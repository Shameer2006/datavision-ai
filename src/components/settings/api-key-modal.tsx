"use client";

import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, CircleCheck as CheckCircle, Circle as XCircle, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredApiKey, setStoredApiKey, clearStoredApiKey } from "@/lib/api-key-store";

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

type ValidationState = "idle" | "validating" | "valid" | "invalid";

export function ApiKeyModal({ open, onClose, onSaved }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [validation, setValidation] = useState<ValidationState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    if (open) {
      const stored = getStoredApiKey();
      if (stored) {
        setApiKey(stored);
        setHasExistingKey(true);
        setValidation("valid");
      } else {
        setApiKey("");
        setHasExistingKey(false);
        setValidation("idle");
      }
      setShowKey(false);
      setErrorMessage("");
    }
  }, [open]);

  const handleValidateAndSave = async () => {
    const key = apiKey.trim();
    if (!key) {
      setErrorMessage("Please enter your Gemini API key.");
      return;
    }

    if (!key.startsWith("AI") || key.length < 20) {
      setErrorMessage("This doesn't look like a valid Gemini API key. Keys typically start with 'AI' and are longer.");
      setValidation("invalid");
      return;
    }

    setValidation("validating");
    setErrorMessage("");

    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setStoredApiKey(key);
        setValidation("valid");
        setHasExistingKey(true);
        onSaved?.();
      } else {
        setValidation("invalid");
        setErrorMessage(data.error || "Invalid API key. Please check and try again.");
      }
    } catch {
      setValidation("invalid");
      setErrorMessage("Could not validate the key. Please check your connection and try again.");
    }
  };

  const handleRemove = () => {
    clearStoredApiKey();
    setApiKey("");
    setHasExistingKey(false);
    setValidation("idle");
    setErrorMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter") handleValidateAndSave();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative w-full max-w-md mx-4 bg-background border border-foreground/10 rounded-2xl shadow-2xl p-6 space-y-5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pr-8">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Gemini API Key</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Required to analyze data and generate visualizations using Google Gemini AI.
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground uppercase tracking-wider font-mono">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setValidation("idle");
                setErrorMessage("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="AIza..."
              className={`w-full h-10 pl-3 pr-10 text-sm font-mono bg-background border rounded-lg outline-none transition-all placeholder:text-muted-foreground/40 ${
                validation === "valid"
                  ? "border-green-300 focus:border-green-400 focus:ring-1 focus:ring-green-200"
                  : validation === "invalid"
                  ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200"
                  : "border-foreground/10 focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
              }`}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Validation feedback */}
          {validation === "valid" && (
            <p className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle className="w-3.5 h-3.5" />
              API key is valid and saved.
            </p>
          )}
          {validation === "invalid" && errorMessage && (
            <p className="flex items-center gap-1.5 text-xs text-red-600">
              <XCircle className="w-3.5 h-3.5" />
              {errorMessage}
            </p>
          )}
          {validation === "idle" && errorMessage && (
            <p className="text-xs text-red-600">{errorMessage}</p>
          )}
        </div>

        {/* Info box */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 space-y-1">
          <p className="text-xs font-medium text-blue-700">How to get your API key</p>
          <ol className="text-xs text-blue-600 space-y-0.5 list-decimal list-inside">
            <li>Go to Google AI Studio</li>
            <li>Sign in with your Google account</li>
            <li>Click "Create API key" and copy it</li>
          </ol>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mt-1"
          >
            Open Google AI Studio
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Security note */}
        <p className="text-[11px] text-muted-foreground/60">
          Your key is stored locally in your browser and sent directly to the analysis endpoint. It is never stored on any server.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {hasExistingKey && (
            <button
              onClick={handleRemove}
              className="text-xs text-red-500 hover:text-red-600 transition-colors mr-auto"
            >
              Remove key
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="ml-auto"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleValidateAndSave}
            disabled={validation === "validating" || !apiKey.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white border-0 min-w-[100px]"
          >
            {validation === "validating" ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Validating...
              </span>
            ) : validation === "valid" && hasExistingKey ? (
              "Update Key"
            ) : (
              "Save & Validate"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
