"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contentTemplates } from "@/lib/content-templates";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Editor } from "./_components/editor";
import { initializeChatSession } from "@/lib/gemini-ai";
import axios from "axios";

interface templateSlugProps {
  templateSlug: string;
}

const TemplatePage = ({ params }: { params: Promise<templateSlugProps> }) => {
  const [isLoading, setisLoading] = useState(false);
  const [aiOutput, setAIOutput] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [resolvedParams, setResolvedParams] = useState<templateSlugProps | null>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  // Unwrapping the promise to access params correctly
  useEffect(() => {
    params.then((resolved) => {
      setResolvedParams(resolved);
    });
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      const template = contentTemplates.find(
        (item) => item.slug === resolvedParams.templateSlug
      );
      setSelectedTemplate(template);
    }
  }, [resolvedParams]);

  useEffect(() => {
    const fetchChatSession = async () => {
      const session = await initializeChatSession();
      setChatSession(session);
    };

    fetchChatSession();
  }, []);

  const generateAIContent = async (formData: FormData) => {
    setisLoading(true);
    try {
      const dataSet = {
        title: formData.get("title"),
        description: formData.get("description"),
      };
  
      const selectedPrompt = selectedTemplate?.aiPrompt;
      const finalAIPrompt = JSON.stringify(dataSet) + ", " + selectedPrompt;
  
      const response = await axios.post("/api/chat", { prompt: finalAIPrompt });
      setAIOutput(response.data.response);
  
      // Sending the generated content to another API
      await axios.post("/api/", {
        title: dataSet.title,
        description: response.data.response,
        templateUsed: selectedTemplate?.name,
      });
  
      setisLoading(false);
    } catch (error) {
      console.error(error);
      setisLoading(false);
      setAIOutput("Error generating content. Please try again.");
    }
  };
  

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    generateAIContent(formData);
  };

  if (!selectedTemplate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-5 py-2">
      <div className="mt-5 py-6 px-4 bg-white rounded">
        <h2 className="font-medium">{selectedTemplate?.name}</h2>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4 p-5 mt-5 bg-white">
          {selectedTemplate?.form?.map((form, index) => (
            <div key={`${selectedTemplate.slug}-${index}`}>
              <label>{form.label}</label>
              {form.field === "input" ? (
                <div className="mt-5">
                  <Input name="title" />
                </div>
              ) : (
                <div className="mt-5">
                  <Textarea name="description" />
                </div>
              )}
            </div>
          ))}
        </div>
        <Button className="mt-5" type="submit">
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            "Generate Content"
          )}
        </Button>
      </form>
      <div className="my-10">
        <Editor value={isLoading ? "Generating..." : aiOutput} />
      </div>
    </div>
  );
};

export default TemplatePage;
