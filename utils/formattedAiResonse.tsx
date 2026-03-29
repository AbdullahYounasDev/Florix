import React from "react";
import { StyleSheet, Text } from "react-native";

export const formatAIResponse = (text: string) => {
  // Remove "Answer:" only
  const cleanedText = text.replace(/^Answer:\s*/i, "");

  // Regex handles:
  // **bold**
  // * bullet at start of line
  // \n line breaks
  const regex = /(\*\*[^*]+\*\*|\n|\*\s)/g;

  const parts = cleanedText.split(regex);

  return (
    <Text>
      {parts.map((part, index) => {
        // Line break
        if (part === "\n") {
          return "\n";
        }

        // Bullet star "* "
        if (part === "* ") {
          return (
            <Text key={index} style={{ fontWeight: "700" }}>
              •{" "}
            </Text>
          );
        }

        // Bold text
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={index} style={{ fontWeight: "700" }}>
              {part.replace(/\*\*/g, "")}
            </Text>
          );
        }

        // Normal text
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};




export const formatAnalysisResponse = (text: string) => {
  if (!text) return null;

  // 1. Remove "Answer:" and standardize markdown headings
  const cleanedText = text
    .replace(/^Answer:\s*/i, "")
    .replace(/^(#{1,6})\s*(.*)$/gm, "**$2**") 
    .trim();

  // 2. Updated Regex to capture:
  // - Standard bold: **text**
  // - Single asterisk bold: *text*
  // - New lines: \n
  // - Bullet/Numbered lines ending in colon: (* Title: or 1. Title:)
  const parts = cleanedText.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\n|^[\s]*(?:[-*•]|\d+\.)\s[^*:\n]+:)/gm);

  return (
    <Text style={styles.baseText}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Handle New Lines
        if (part === "\n") {
          return "\n";
        }

        // Handle Standard Bold Text (**Bold**)
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={index} style={styles.boldText}>
              {part.replace(/\*\*/g, "")}
            </Text>
          );
        }

        // Handle Single Asterisk Bold (*Bold*)
        if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
          return (
            <Text key={index} style={styles.boldText}>
              {part.replace(/^\*|\*$/g, "")}
            </Text>
          );
        }

        // Handle Bullet OR Numbered Points ending with Colon 
        // Example: "• Feature:" or "1. Analysis:"
        if (/^[\s]*(?:[-*•]|\d+\.)\s.*:$/.test(part)) {
          // If it's a bullet, standardize it to "• ". If it's a number, keep the number.
          const cleanLine = part.replace(/^[\s]*[-*•]\s/, "• ");
          return (
            <Text key={index} style={styles.boldText}>
              {cleanLine}
            </Text>
          );
        }

        // Handle regular Bullet Points (without colons)
        if (/^[\s]*[-*•]\s/.test(part)) {
          const bulletContent = part.replace(/^[\s]*[-*•][\s]+/gm, "• ");
          return <Text key={index}>{bulletContent}</Text>;
        }

        // Handle text with colon - apply dot rule
        if (part.includes(":")) {
          const colonIndex = part.indexOf(":");
          const beforeColon = part.substring(0, colonIndex + 1);
          const afterColon = part.substring(colonIndex + 1);
          
          // Check if there's a dot before the colon
          const lastDotIndex = beforeColon.lastIndexOf(".");
          
          if (lastDotIndex !== -1) {
            // If dot exists, split at the dot
            const beforeDot = beforeColon.substring(0, lastDotIndex + 1);
            const betweenDotAndColon = beforeColon.substring(lastDotIndex + 1);
            
            return (
              <Text key={index}>
                <Text>{beforeDot}</Text>
                <Text style={styles.boldText}>{betweenDotAndColon}</Text>
                {afterColon}
              </Text>
            );
          } else {
            // No dot, make everything before colon bold
            return (
              <Text key={index}>
                <Text style={styles.boldText}>{beforeColon}</Text>
                {afterColon}
              </Text>
            );
          }
        }

        // Normal Text
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontSize: 16,
    lineHeight: 30,
  },
  boldText: {
    fontWeight: "700",
  },
});

