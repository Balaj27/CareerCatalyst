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
    "position_Title": A string representing the job title.
    "experience": An array of strings, each representing a bullet point describing relevant experience for the given job title in html format.
For the Job Title "{positionTitle}", create a JSON object with the following fields:
The experience array should contain 5-7 bullet points. Each bullet point should be a concise description of a relevant skill, responsibility, or achievement.`;

function RichTextEditor({
  onRichTextEditorChange,
  index,
  resumeInfo,
  section = "experience", // "projects" or "experience"
  field = "workSummary", // "projectSummary" or "workSummary"
}) {
  const [value, setValue] = useState(
    resumeInfo?.[section]?.[index]?.[field] || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value, field, index);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    const jobTitle =
      resumeInfo?.[section]?.[index]?.title ||
      resumeInfo?.[section]?.[index]?.projectName;

    if (!jobTitle) {
      toast("Please add a title or project name first.");
      return;
    }

    setLoading(true);
    try {
      const prompt = PROMPT.replace("{positionTitle}", jobTitle);
      const result = await AIChatSession.sendMessage(prompt);
      const resp = JSON.parse(result.response.text());

      const generated =
        resp.experience?.join("") ||
        resp.experience_bullets?.join("") ||
        "";

      setValue(generated);
    } catch (err) {
      toast("AI generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
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
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e.target.value, field, index);
          }}
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

export default RichTextEditor;
