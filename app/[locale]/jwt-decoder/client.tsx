"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { decodeJwt, buildSampleJwt, verifyJwtHmac, type JwtParts } from "@/lib/tools/jwt";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Clock, ShieldCheck, ShieldX } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcut";

const MAX_INPUT_SIZE = 5 * 1024 * 1024; // 5MB

function JsonBlock({ label, data }: { label: string; data: Record<string, unknown> | null }) {
  if (!data) return null;
  const json = JSON.stringify(data, null, 2);
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{label}</h3>
        <CopyButton text={json} />
      </div>
      <pre className="overflow-auto whitespace-pre-wrap font-mono text-sm text-muted-foreground">
        {json}
      </pre>
    </div>
  );
}

export default function JwtDecoderClient() {
  const t = useTranslations();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<JwtParts | null>(null);
  const [secret, setSecret] = useState("");
  const [signatureValid, setSignatureValid] = useState<boolean | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    setResult(decodeJwt(input));
  }, [input]);

  const handleSample = useCallback(() => {
    const sample = buildSampleJwt();
    setInput(sample);
    setResult(decodeJwt(sample));
  }, []);

  const handleVerify = useCallback(async () => {
    const res = await verifyJwtHmac(input, secret);
    setSignatureValid(res.valid);
    setVerifyError(res.error);
  }, [input, secret]);

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
    setSecret("");
    setSignatureValid(null);
    setVerifyError(null);
  }, []);

  const shortcuts = useMemo(() => ({
    "ctrl+enter": handleDecode,
  }), [handleDecode]);
  useKeyboardShortcuts(shortcuts);

  const inputSize = useMemo(() => new TextEncoder().encode(input).length, [input]);
  const isOversize = inputSize > MAX_INPUT_SIZE;

  return (
    <ToolLayout toolKey="jwtDecoder">
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={handleDecode}>{t("tools.jwtDecoder.decode")}</Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleSample}>
          {t("common.sample")}
        </Button>
        <Button variant="outline" size="sm" onClick={handleClear}>
          {t("common.clear")}
        </Button>
      </div>

      {/* Color-coded token preview */}
      {input.trim() && input.includes(".") && (
        <div className="mb-4 overflow-auto rounded-lg border bg-card p-4">
          <p className="break-all font-mono text-sm">
            {(() => {
              const parts = input.trim().split(".");
              if (parts.length !== 3) return <span>{input}</span>;
              return (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400">{parts[0]}</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-amber-600 dark:text-amber-400">{parts[1]}</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-foreground/50">{parts[2]}</span>
                </>
              );
            })()}
          </p>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span><span className="inline-block h-2 w-2 rounded-full bg-emerald-600 mr-1"></span>Header</span>
            <span><span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-1"></span>Payload</span>
            <span><span className="inline-block h-2 w-2 rounded-full bg-foreground/40 mr-1"></span>Signature</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="jwt-input" className="text-sm font-medium">{t("common.input")}</label>
          {input && (
            <span className={`text-xs ${isOversize ? "text-destructive" : "text-muted-foreground"}`}>
              {(inputSize / 1024).toFixed(1)} KB
            </span>
          )}
        </div>
        <Textarea
          id="jwt-input"
          value={input}
          onChange={(e) => {
            const val = e.target.value;
            setInput(val);
            if (val.trim()) {
              setResult(decodeJwt(val.trim()));
            } else {
              setResult(null);
            }
          }}
          placeholder={t("tools.jwtDecoder.inputPlaceholder")}
          className="min-h-[120px] font-mono text-sm"
        />
      </div>

      {/* Error */}
      {result?.error && (
        <div role="alert" className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{result.error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !result.error && (
        <div className="space-y-4" aria-live="polite">
          {/* Expiration status */}
          {result.isExpired !== null && (
            <div className="flex items-center gap-2">
              {result.isExpired ? (
                <Badge variant="destructive" className="gap-1">
                  <Clock className="h-4 w-4" />
                  {t("tools.jwtDecoder.expired")}
                  {result.expiresAt && ` — ${new Date(result.expiresAt).toLocaleString()}`}
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("tools.jwtDecoder.valid")}
                  {result.expiresAt && ` — expires ${new Date(result.expiresAt).toLocaleString()}`}
                </Badge>
              )}
            </div>
          )}

          {/* Header, Payload, Signature */}
          <JsonBlock label={t("tools.jwtDecoder.header")} data={result.header} />
          <JsonBlock label={t("tools.jwtDecoder.payload")} data={result.payload} />

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-semibold">{t("tools.jwtDecoder.signature")}</h3>
            <p className="break-all font-mono text-sm text-muted-foreground">
              {result.signature}
            </p>
          </div>

          {/* Signature Verification */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-semibold">{t("tools.jwtDecoder.verify")}</h3>
            <div className="flex items-center gap-2">
              <Input
                id="jwt-secret"
                type="password"
                value={secret}
                onChange={(e) => { setSecret(e.target.value); setSignatureValid(null); setVerifyError(null); }}
                placeholder={t("tools.jwtDecoder.secretPlaceholder")}
                className="font-mono flex-1"
              />
              <Button size="sm" onClick={handleVerify} disabled={!secret}>
                {t("tools.jwtDecoder.verify")}
              </Button>
            </div>
            {signatureValid !== null && (
              <div className="mt-2">
                {signatureValid ? (
                  <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                    {t("tools.jwtDecoder.validSignature")}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <ShieldX className="h-4 w-4" />
                    {t("tools.jwtDecoder.invalidSignature")}
                  </Badge>
                )}
              </div>
            )}
            {verifyError && (
              <p className="mt-2 text-xs text-destructive">{verifyError}</p>
            )}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
