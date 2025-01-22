"use client";
import { useCallback } from "react";

interface IframeMessage {
  type: "iframe-message";
  message: string;
}

/**
 * Custom hook to handle errors in an iframe and send them to the parent window.
 * @param parentOrigin - The trusted origin of the parent window (use "*" for all origins in development).
 * @returns An object containing a function to send the message to the parent
 */
const useIframeMessageHandler = (parentOrigin: string = "*") => {
  const sendMessageToParent = useCallback(
    (message: string) => {
      try {
        const payload: IframeMessage = {
          type: "iframe-message",
          message,
        };
        window.parent.postMessage(
          payload,
          parentOrigin
        );
      } catch (postError) {
        console.error("Failed to post message to parent:", postError);
      }
    },
    [parentOrigin]
  );

  return {sendMessageToParent};
};

export default useIframeMessageHandler;
