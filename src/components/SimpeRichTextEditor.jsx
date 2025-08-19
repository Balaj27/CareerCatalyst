import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "../Services/AiModel";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle } from "lucide-react";

const PROMPT = `Create a JSON object with the following fields:
"projectName": A string representing the project
"techStack":A string representing the project tech stack
"projectSummary": An array of strings, each representing a bullet point in html format describing relevant experience for the given project tittle and tech stack
projectName-"{projectName}"
techStack-"{techStack}"`;

function SimpeRichTextEditor({ index, section, field, onRichTextEditorChange, resumeInfo, initialValue }) {
  // Initialize with initialValue if provided, otherwise try to get from resumeInfo
  const [value, setValue] = useState(() => {
    if (initialValue) return initialValue;
    if (resumeInfo?.[section]?.[index]?.[field]) {
      return resumeInfo[section][index][field];
    }
    return "";
  });
  
  const [loading, setLoading] = useState(false);

  // This effect runs when resumeInfo changes to keep the editor in sync
  useEffect(() => {
    // Only update value from resumeInfo if it's different from current value
    // and exists to prevent unnecessary updates
    const newValue = resumeInfo?.[section]?.[index]?.[field];
    if (newValue !== undefined && newValue !== value) {
      setValue(newValue);
    }
  }, [resumeInfo, section, index, field]);

  // Handle changes to the editor
  const handleEditorChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    // Pass the new value up to the parent component with all required params
    onRichTextEditorChange(newValue, field, index);
  };

  const GenerateSummaryFromAI = async () => {
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    setLoading(true);

    try {
      const prompt = PROMPT.replace(
        "{projectName}",
        resumeInfo?.projects[index]?.projectName
      ).replace("{techStack}", resumeInfo?.projects[index]?.techStack);
      
      console.log("Prompt", prompt);
      const result = await AIChatSession.sendMessage(prompt);
      const resp = JSON.parse(result.response.text());
      console.log("Response", resp);
      
      const newSummary = resp.projectSummary?.join("") || "";
      setValue(newSummary);
      // Make sure to also pass this up to the parent
      onRichTextEditorChange(newSummary, field, index);
      
    } catch (error) {
      console.error("Error generating summary:", error);
      toast("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={handleEditorChange}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default SimpeRichTextEditor;