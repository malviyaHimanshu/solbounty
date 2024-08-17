"use client";
import { coromorantGaramond } from "@/lib/fonts";
import { cn, fromNow } from "@/lib/utils";
import { Avatar, Input, Skeleton } from "@nextui-org/react";
import { CheckIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";
import IssueOpenSymbol from "@/components/img/IssueOpenSymbol";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import IssueCloseSymbol from "@/components/img/IssueCloseSymbol";
import USDCLogo from "@/components/img/USDCLogo";
import SolanaLogo from "@/components/img/SolanaLogo";

const githubIssueSchema = z.string().regex(
  /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)\/issues\/(\d+)$/,
  'Invalid GitHub issue URL'
);

export default function CreateBounty() {
  const [value, setValue] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenLogo, setTokenLogo] = useState<React.ReactNode | null>(<USDCLogo height="14" />);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (!isDirty) {
      setIsDirty(true);
    }

    try {
      githubIssueSchema.safeParse(inputValue);
      setIsValid(true);
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
      setIsValid(false);
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

  const handleTokenChange = (e: any) => {
    console.log(e.target.value);
    switch (e.target.value) {
      case 'USDC':
        console.log('USDC selected');
        setTokenLogo(<USDCLogo height="14" />);
        break;
      case 'SOL':
        console.log('SOL selected');
        setTokenLogo(<SolanaLogo height="12" />);
        break;
      default:
        console.error('Invalid token selected');
    }
  }

  return (
    <div>
      <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Create bounty</h1>
      <p className="mt-2 text-zinc-500">Create a new bounty and get it published on GitHub.</p>

      <div className="mt-10">
        <div className="flex items-center gap-5">  
          <Input
            isRequired
            type="text"
            placeholder="https://github.com/owner/repo/issues/121"
            label="Issue URL"
            labelPlacement="outside"
            description="URL or short identifier of the issue"
            variant="bordered"
            value={value || ''}
            onChange={handleInputChange}
            isInvalid={isDirty && !isValid}
            errorMessage={error}
            endContent={isDirty && isValid && (
              <div className="p-0.5 rounded-full bg-green-500">
                <CheckIcon color="white" />
              </div>
            )}
            color={(isDirty && isValid) ? 'success' : 'default'}
            // isDisabled={loading} // Disable input while loading
          />

          <Input
            isRequired
            type="number"
            label="Amount"
            placeholder="0.00"
            labelPlacement="outside"
            description="Amount you'll pay beforehand which goes to contributor"
            variant="bordered"
            startContent={
              <div className="pointer-events-none flex items-center">
                { tokenLogo }
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
                <h1 className="text-2xl font-medium tracking-tight text-zinc-800">
                  {issue.title}
                  <span className="text-zinc-500 font-normal">&nbsp;#{issue.number}</span>
                </h1>

                <div className="mt-2 flex items-center gap-2">
                  { issue.state === 'open' && (
                    <p className="flex items-center gap-0.5 py-1 px-2 pr-3 rounded-full bg-green-600 w-fit">
                      <IssueOpenSymbol color="#ffffff" height="14" />
                      <span className="text-white text-sm font-medium">Open</span>
                    </p>
                  )}
                  { issue.state === 'closed' && (
                    <p className="flex items-center gap-0.5 py-1 px-2 pr-3 rounded-full bg-purple-600 w-fit">
                      <IssueCloseSymbol color="#ffffff" height="14" />
                      <span className="text-white text-sm font-medium">Closed</span>
                    </p>
                  )}

                  <p className="text-sm text-zinc-500">
                    <span className="font-semibold hover:underline"><a href={issue.user?.html_url}>{issue.user?.login}</a></span> opened this issue {fromNow(issue.created_at)} · {issue.comments} comments
                  </p>
                </div>
                
                <hr className="mt-3 mb-5 border-zinc-200" />

                <div className="flex items-start gap-3">
                  <Avatar
                    src={issue.user?.avatar_url}
                    alt={issue.user?.login}
                    size="md"
                  />

                  <div className="border border-zinc-200 rounded">
                    <div className="bg-zinc-100 px-5 py-3">
                      <p className="text-sm text-zinc-500">
                        <span className="font-semibold hover:underline"><a href={issue.user?.html_url}>{issue.user?.login}</a></span> commented {fromNow(issue.created_at)}
                      </p>
                    </div>
                    <div className="p-5 text-sm">
                      <ReactMarkdown
                        children={issue.body}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        className="prose prose-zinc text-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Skeleton>
      </div>
    </div>
  );
}