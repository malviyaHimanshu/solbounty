"use client";
import { coromorantGaramond } from "@/lib/fonts";
import { cn, fromNow } from "@/lib/utils";
import { Avatar, Input, Skeleton } from "@nextui-org/react";
import { CheckIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { isValid, z } from "zod";
import axios from "axios";
import IssueOpenSymbol from "@/components/img/IssueOpenSymbol";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import IssueCloseSymbol from "@/components/img/IssueCloseSymbol";
import USDCLogo from "@/components/img/USDCLogo";
import SolanaLogo from "@/components/img/SolanaLogo";
import Button from "@/components/button";
import { PlusOutlinedIcon } from "@/icons";
import toast from "react-hot-toast";

const githubIssueSchema = z.string().regex(
  /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/issues\/(\d+)$/,
  'Invalid GitHub issue URL'
);

interface Token {
  name: string;
  symbol: string;
  logo: React.ReactNode;
}

export default function CreateBounty() {
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const [isIssueUrlValid, setIsIssueUrlValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [tokenAmount, setTokenAmount] = useState<string | null>(null);
  const [token, setToken] = useState<Token | null>({
    name: 'USDC',
    symbol: 'USDC',
    logo: <USDCLogo height="14" />,
  });

  const handleIssueUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setIssueUrl(inputValue);

    if (!isDirty) {
      setIsDirty(true);
    }

    try {
      githubIssueSchema.safeParse(inputValue);
      setIsIssueUrlValid(true);
      setError(null);

      // Extract owner, repo, and issue number from the URL using match
      const match = inputValue.match(
        /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/issues\/(\d+)$/
      );
      if (!match) throw new Error("Invalid GitHub issue URL");

      const [, owner, repo, issueNumber] = match;

      // Fetch issue details from GitHub API
      setLoading(true);
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`
      );
      console.log(response.data);
      setIssue(response.data);
    } catch (err) {
      setIsIssueUrlValid(false);
      setIssue(null);
      setLoading(false);
      setError(
        err instanceof Error && err.message !== 'Network Error'
          ? err.message
          : 'Unable to fetch issue details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTokenAmountChange = (e: any) => {
    const inputValue = e.target.value;
    if (/^\d*\.?\d*$/.test(inputValue)) { // Regex to allow only numbers and decimal points
      setTokenAmount(inputValue);
    }
  }

  const handleTokenChange = (e: any) => {
    switch (e.target.value) {
      case 'USDC':
        const USDCToken = {
          name: 'USDC',
          symbol: 'USDC',
          logo: <USDCLogo height="14" />,
        }
        setToken(USDCToken);
        break;
      case 'SOL':
        const SOLToken = {
          name: 'Solana',
          symbol: 'SOL',
          logo: <SolanaLogo height="12" />,
        }
        setToken(SOLToken);
        break;
      default:
        console.error('Invalid token selected');
    }
  }

  const handleCreateBounty = () => {
    if (!issueUrl || !tokenAmount) {
      setIsDirty(true);
      return;
    }

    // toast.success('Bounty created successfully');

    console.log('Creating bounty');
    console.log('issue url :', issueUrl);
    console.log('amount :', tokenAmount);
  }

  return (
    <div>
      <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Create bounty</h1>
      <p className="mt-2 text-zinc-500">Create a new bounty and get it published on GitHub.</p>

      <div className="mt-10 pb-20">
        <div className="flex flex-wrap md:flex-nowrap items-start gap-5">  
          <Input
            isRequired
            type="text"
            placeholder="https://github.com/owner/repo/issues/121"
            label="Issue URL"
            labelPlacement="outside"
            description="URL or short identifier of the issue"
            variant="bordered"
            value={issueUrl || ''}
            onChange={handleIssueUrlChange}
            isInvalid={isDirty && !isIssueUrlValid}
            errorMessage={error}
            endContent={isDirty && isIssueUrlValid && (
              <div className="p-0.5 rounded-full bg-green-500">
                <CheckIcon color="white" />
              </div>
            )}
            color={(isDirty && isIssueUrlValid) ? 'success' : 'default'}
            // isDisabled={loading} // Disable input while loading
          />

          <Input
            isRequired
            className="max-w-sm"
            type="number"
            label="Amount"
            placeholder="0.00"
            labelPlacement="outside"
            description="Amount you'll pay beforehand which goes to contributor"
            variant="bordered"
            value={tokenAmount || ''}
            onChange={handleTokenAmountChange}
            startContent={
              <div className="pointer-events-none flex items-center">
                { token?.logo }
              </div>
            }
            endContent={
              <div className="flex items-center">
                <select
                  className="outline-none border-0 bg-transparent text-zinc-500 text-small"
                  id="token"
                  name="token"
                  onChange={handleTokenChange}
                >
                  <option>USDC</option>
                  <option>SOL</option>
                </select>
              </div>
            }
          />
        </div>

        <Skeleton isLoaded={!loading} className="mt-5 rounded">
          <div className="mt-5">
            { issue && (
              <>
                <h1 className="text-3xl font-medium tracking-tight text-zinc-800">
                  {issue.title}
                  <span className="text-zinc-500 font-normal">&nbsp;#{issue.number}</span>
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    { issue.state === 'open' && (
                      <p className="flex items-center gap-0.5 py-1 px-2 pr-3 rounded-full bg-green-600 border border-green-600 w-fit">
                        <IssueOpenSymbol color="#ffffff" height="14" />
                        <span className="text-white text-sm font-medium">Open</span>
                      </p>
                    )}
                    { issue.state === 'closed' && (
                      <p className="flex items-center gap-0.5 py-1 px-2 pr-3 rounded-full bg-purple-600 border border-purple-600 w-fit">
                        <IssueCloseSymbol color="#ffffff" height="14" />
                        <span className="text-white text-sm font-medium">Closed</span>
                      </p>
                    )}
                    { (Number(tokenAmount) > 0) && (
                      <p className="flex items-center gap-1 py-1 px-2 pr-3 rounded-full bg-green-100 border border-green-500 text-green-700 w-fit">
                        { token?.logo }
                        <span className="text-sm font-medium tracking-tight text-nowrap">{ tokenAmount } { token?.symbol }</span>
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-zinc-500">
                    <span className="font-semibold hover:underline"><a href={issue.user?.html_url}>{issue.user?.login}</a></span> opened this issue {fromNow(issue.created_at)} · {issue.comments} comments
                  </p>
                </div>
                
                <hr className="mt-3 mb-5 border-zinc-200" />

                <div className="flex items-start gap-3 w-full overflow-x-scroll">
                  <Avatar
                    showFallback
                    src={issue.user?.avatar_url}
                    alt={issue.user?.login}
                    size="md"
                    className="min-w-fit"
                  />

                  <div className="border border-zinc-200 rounded-md">
                    <div className="bg-zinc-50 px-4 py-2 rounded-t-md border-b border-zinc-200">
                      <p className="text-sm text-zinc-500">
                        <span className="font-semibold hover:underline"><a href={issue.user?.html_url}>{issue.user?.login}</a></span> commented {fromNow(issue.created_at)}
                      </p>
                    </div>
                    <div className="p-4 py-3 text-sm">
                      <ReactMarkdown
                        children={issue.body}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        className="prose prose-zinc text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <hr className="my-5 border-zinc-200" />
              </>
            )}
          </div>
        </Skeleton>

        <div className="mt-5">
          <Button disabled={!isValid || !isIssueUrlValid || isSubmitting || !tokenAmount || Number(tokenAmount) <= 0 || !issueUrl} onClick={handleCreateBounty} color="black" className="flex items-center gap-1.5">
            <PlusOutlinedIcon color="#ffffff" />
            Create bounty
          </Button>
        </div>
      </div>
    </div>
  );
}