"use client";

import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast, useToast } from "@/components/ui/use-toast";
import { Sparkles, ChevronDown, Router } from "lucide-react";
import { categories, Category } from "@/lib/categories";
import { useRouter } from "next/navigation";

const AnimatedBorderCard = ({ category, isSelected, onSelect }: { category: Category, isSelected: boolean, onSelect: (categoryId: number) => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event: { clientX: number; clientY: number; }) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getGradientStyle = () => {
    const { x, y } = mousePos;
    const size = 50; // Size of the gradient effect
    return {
      background: `radial-gradient(circle ${size}px at ${x}px ${y}px, rgba(255,255,255,0.3), transparent)`,
      mask: `radial-gradient(circle ${size}px at ${x}px ${y}px, black, transparent)`,
      WebkitMask: `radial-gradient(circle ${size}px at ${x}px ${y}px, black, transparent)`,
    };
  };
  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(category.id)}
      className={`relative bg-gradient-to-br ${
        isSelected
          ? "from-blue-500 to-purple-600"
          : "from-[#2b2d31] to-[#3d4046]"
      } shadow-lg rounded-lg p-6 cursor-pointer transition-all duration-300 backdrop-blur-sm group`}
    >
      <div
        className="absolute inset-0 rounded-lg z-10 pointer-events-none"
        style={getGradientStyle()}
      ></div>
      <div
        className={`absolute inset-0 rounded-lg z-[-1] ${
          isSelected ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500 pointer-events-none`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 opacity-50 blur-xl rounded-lg transition-transform duration-500 group-hover:blur-none"></div>
      </div>
      <div className="relative z-20 flex justify-between items-center">
        <h3 className="font-semibold text-xl">{category.name}</h3>
        <category.icon
          className={`w-6 h-6 ${isSelected ? "text-white" : "text-blue-400"}`}
        />
      </div>
    </motion.div>
  );
};

const Interests: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previousInterests, setPreviousInterests] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const router = useRouter();


  const categoriesSectionRef = useRef<HTMLDivElement>(null);

  const {toast} = useToast();

  useEffect(() => {
    const fetchPreviousInterests = async () => {
      try {
        const response = await axios.get("/api/interests");
        setPreviousInterests(response.data.interests);
        setShowCategories(response.data.interests.length === 0);
      } catch (error) {
        console.error("Error fetching previous interests:", error);
        setShowCategories(true);
      }
    };

    fetchPreviousInterests();
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      // Show the button after scrolling down 100 pixels
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToCategories = () => {
    categoriesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategorySelect = (categoryId: number) => {
    if(selectedCategories.length > 3) {
      toast({
        title: "Maximum interests reached",
        description: "You can only select up to 3 interests",
        duration: 5000,
      });
    }
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else if (prev.length < 3) {
        return [...prev, categoryId];
      } else {
        toast({
          title: "Maximum interests reached",
          description: "You can only select up to 3 interests",
          duration: 5000,
        });
        return prev;
      }
    });
  };

  const saveInterests = async () => {
    setIsLoading(true);
    try {
      const selectedInterests = selectedCategories
        .map((id) => categories.find((cat) => cat.id === id)?.name)
        .filter((name): name is string => name !== undefined);

      const response = await axios.post("/api/interests", {
        interests: selectedInterests,
        replaceExisting: true,
      });

      if (response.data.success) {
        router.replace("/curated-feed");
        toast({
          title: "Interests saved",
          description: "Your interests have been updated successfully",
          duration: 5000,
        });
        setPreviousInterests(selectedInterests);
      } else {
        toast({
          title: "Failed to save interests",
          description: response.data.message || "Please try again later",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error saving interests:", error);
      toast({
        title: "Failed to save interests",
        description: "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const continuePreviousInterests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/interests", {
        interests: previousInterests,
        replaceExisting: false,
      });

      if (response.data.success) {
        await router.replace("/curated-feed");
        toast({
          title: "Continuing with previous interests",
          description: "Your previous interests have been loaded",
          duration: 5000,
        });
        // setShowCategories(true);
      } else {
        toast({
          title: "Failed to continue with previous interests",
          description: response.data.message || "Please try again later",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error continuing with previous interests:", error);
      toast({
        title: "Failed to continue with previous interests",
        description: "Please try again later",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1d21] min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center mb-12"
        >
          <h2 className="text-4xl md:text-4xl font-bold  text-white">
            What are we watching?
          </h2>
        </motion.div>
        {!showCategories && previousInterests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center h-[70vh]"
          >
            <Card className="w-full max-w-2xl border-0 bg-gradient-to-br from-[#2b2d31] to-[#3d4046] shadow-lg backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center gap-8 p-10">
                <div className="space-y-4 text-center">
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Resume Your Journey?
                  </h3>
                  <p className="text-gray-300 text-lg">
                    We&apos;ve saved your previous interests.  
                  </p>
                </div>
                <div className="flex w-full items-center justify-between text-sm">
                  <Button
                    onClick={() => setShowCategories(true)}
                    variant="ghost"
                    className="text-blue-400 hover:text-white hover:bg-[#2b2d31] transition-colors duration-300"
                  >
                    Explore New Interests
                  </Button>
                  <Button
                    onClick={continuePreviousInterests}
                    disabled={isLoading}
                    className="w-full max-w-[200px] bg-white text-black cursor-pointer hover:bg-white"
                  >
                    {isLoading ? "Loading..." : "Continue Journey"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {showCategories && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center mb-12"
            >
              <div className="relative z-10 w-full max-w-2xl flex items-center overflow-hidden rounded-lg shadow-lg p-0.5 ">
                <div className="animate-rotate absolute inset-0 h-full w-full rounded-lg bg-[conic-gradient(#60a5fa_20deg,transparent_120deg)]"></div>
                <Card className="relative z-20 w-full border-0 bg-gradient-to-br from-[#2b2d31] to-[#3d4046] shadow-lg backdrop-blur-sm rounded-lg">
                  <CardContent className="flex flex-col items-center justify-center gap-8 p-10">
                    <div className="space-y-4 text-center">
                      <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Your Experience! Your Choice!
                      </h3>
                      <p className="text-gray-300 text-lg">
                        Choose up to 3 categories that you need to watch
                      </p>
                    </div>
                    <div className="flex w-full items-center justify-between text-sm">
                      <Button
                        onClick={handleScrollToCategories}
                        variant="ghost"
                        className="text-blue-400 hover:text-white hover:bg-[#2b2d31] transition-colors duration-300"
                      >
                        Explore All Categories <ChevronDown className="ml-2" />
                      </Button>
                      <Button
                        onClick={saveInterests}
                        disabled={selectedCategories.length === 0 || isLoading}
                        className="w-full max-w-[200px] bg-white text-black cursor-pointer hover:bg-white"
                      >
                        {isLoading ? "Saving..." : "Save Interests"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            <motion.div
              ref={categoriesSectionRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-sm lg:grid-cols-4 gap-6"
            >
              {categories.map((category) => (
                <AnimatedBorderCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories.includes(category.id)}
                  onSelect={handleCategorySelect}
                />
              ))}
            </motion.div>
          </>
        )}
      </div>
      {isVisible && (
         <div className={`sticky bottom-0 w-full flex justify-end pr-8 py-8`}>
         <Button className="bg-[#0f0f0f] hover:bg-[#0f0f0f]" onClick={() => {window.scrollTo({top:0, behavior: 'smooth'})}}>
           CTRL UP
         </Button>
       </div>
      )  
      }

      
     
    </div>
  );
};

export default Interests;
