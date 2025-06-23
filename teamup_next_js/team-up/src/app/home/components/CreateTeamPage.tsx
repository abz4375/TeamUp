"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { ChevronRight, ChevronLeft, Check, Edit3, Eye, Loader2, Users, Search } from "lucide-react"; // WysiwygIcon replaced by Edit3/Eye

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Using a consistent style

interface User {
  name: string;
  emailId: string;
  profilePic: string;
  empty?: boolean; // For initial placeholder
}

interface CreateTeamPageProps {
  toggle: boolean; // Controls Dialog open state from parent
  userDetail: User; // Current user details
  setCreateTeamToggle: (open: boolean) => void;
  setRefreshHomePage: (refresh: boolean) => void;
  isDarkMode: boolean; // For styling consistency if needed beyond shadcn's theme
}

function CreateTeamPage(props: CreateTeamPageProps) {
  const [userSearchTerm, setUserSearchTerm] = React.useState("");
  const [searchedUsers, setSearchedUsers] = React.useState<User[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [projectTitle, setProjectTitle] = React.useState("");
  const [projDescMarkdown, setProjDescMarkdown] = React.useState(
    "* [ ] Write Description in 📝 `Markdown`!"
  );
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(0); // 0 for project details, 1 for team
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([props.userDetail]);
  const [showMarkdownPreview, setShowMarkdownPreview] = React.useState(false);

  const [openUserSearch, setOpenUserSearch] = React.useState(false);


  // Debounce search
  React.useEffect(() => {
    if (!userSearchTerm.trim()) {
      setSearchedUsers([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const timerId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/user-search?t=${userSearchTerm}`);
        if (response.ok) {
          const responseJson = await response.json();
          setSearchedUsers(Array.isArray(responseJson) ? responseJson : []);
        } else {
          setSearchedUsers([]);
          console.error("User search failed:", response.statusText);
        }
      } catch (error) {
        setSearchedUsers([]);
        console.error("Error during user search:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timerId);
  }, [userSearchTerm]);


  const handleDialogStateChange = (open: boolean) => {
    props.setCreateTeamToggle(open);
    if (!open) { // Reset state when dialog closes
      setCurrentPage(0);
      setProjectTitle("");
      setProjDescMarkdown("* [ ] Write Description in 📝 `Markdown`!");
      setSelectedUsers([props.userDetail]);
      setUserSearchTerm("");
      setShowMarkdownPreview(false);
    }
  };

  const handleNext = () => setCurrentPage(1);
  const handlePrev = () => setCurrentPage(0);

  const handleSubmit = async () => {
    if (!projectTitle.trim()) {
      alert("Project title is required.");
      return;
    }
    setSubmitLoading(true);
    const contributorEmails = Array.from(new Set(selectedUsers.map((user) => user.emailId)));

    const data = {
      title: projectTitle,
      description: projDescMarkdown,
      owner: props.userDetail.emailId,
      maintainers: [props.userDetail.emailId], // Owner is initially the only maintainer
      contributors: contributorEmails,
      tasks: [],
      contributions: [],
    };

    try {
      const response = await fetch('/api/create-project', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(45000)
      });

      if (response.status === 201) {
        props.setRefreshHomePage(true);
        handleDialogStateChange(false); // Close dialog
      } else {
        const errorData = await response.json();
        alert(`Error creating project: ${errorData.message || response.statusText}`);
        console.error("Project creation failed:", response.statusText, errorData);
      }
    } catch (error) {
      alert("An unexpected error occurred while creating the project.");
      console.error('Error creating project:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find(u => u.emailId === user.emailId)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setUserSearchTerm(""); // Clear search input
    setOpenUserSearch(false); // Close popover
  };

  const handleUserRemove = (emailId: string) => {
    if (emailId === props.userDetail.emailId) return; // Prevent removing owner
    setSelectedUsers(prev => prev.filter(user => user.emailId !== emailId));
  };


  return (
    <Dialog open={props.toggle} onOpenChange={handleDialogStateChange}>
      <DialogContent className={`max-w-3xl w-[90vw] md:w-[70vw] p-0 ${props.isDarkMode ? 'dark' : ''}`}>
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl md:text-3xl font-light text-center">
            {currentPage === 0 ? "New Project Details" : "Add Team Members"}
          </DialogTitle>
          {/* <DialogDescription className="text-center">
            {currentPage === 0 ? "Define your project's title and description." : "Search and add contributors to your project."}
          </DialogDescription> */}
        </DialogHeader>

        <div className="px-6 py-2 max-h-[65vh] overflow-y-auto space-y-6">
          {currentPage === 0 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="projectTitle" className="text-base">Project Title</Label>
                <Input
                  id="projectTitle"
                  type="text"
                  placeholder="Enter a catchy project title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="mt-1.5 h-11 text-base"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label htmlFor="projectDesc" className="text-base">Project Description (Markdown)</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}>
                    {showMarkdownPreview ? <Edit3 className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                    {showMarkdownPreview ? "Edit" : "Preview"}
                  </Button>
                </div>
                {showMarkdownPreview ? (
                  <div className={`prose dark:prose-invert p-4 border rounded-md min-h-[200px] ${props.isDarkMode ? 'border-slate-700 bg-slate-800/30' : 'border-slate-300 bg-slate-50/50'}`}>
                    <Markdown remarkPlugins={[remarkGfm]} components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={`px-1 rounded ${props.isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}>
                      {projDescMarkdown || "Nothing to preview yet."}
                    </Markdown>
                  </div>
                ) : (
                  <Textarea
                    id="projectDesc"
                    placeholder="Describe your project using Markdown..."
                    value={projDescMarkdown}
                    onChange={(e) => setProjDescMarkdown(e.target.value)}
                    rows={8}
                    className="mt-1.5 text-sm"
                  />
                )}
              </div>
            </div>
          )}

          {currentPage === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="userSearch" className="text-base">Search & Add Contributors</Label>
                <Popover open={openUserSearch} onOpenChange={setOpenUserSearch}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openUserSearch} className="w-full justify-between mt-1.5 h-11">
                      {userSearchTerm || "Search by name or email..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command shouldFilter={false}> {/* We handle filtering via API */}
                      <CommandInput
                        placeholder="Type to search users..."
                        value={userSearchTerm}
                        onValueChange={setUserSearchTerm}
                        className="h-10"
                      />
                      <CommandList>
                        {searchLoading && <CommandItem disabled className="flex justify-center py-2"><Loader2 className="h-5 w-5 animate-spin" /></CommandItem>}
                        {!searchLoading && !searchedUsers.length && userSearchTerm.length > 0 && (
                          <CommandEmpty>No users found.</CommandEmpty>
                        )}
                        {!searchLoading && searchedUsers.length > 0 && (
                          <CommandGroup heading="Search Results">
                            {searchedUsers.map((user) => (
                              <CommandItem
                                key={user.emailId}
                                value={user.emailId} // Important for Command navigation
                                onSelect={() => handleUserSelect(user)}
                                className="flex items-center py-2 px-3 cursor-pointer"
                              >
                                <ShadcnAvatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={user.profilePic} alt={user.name} />
                                  <AvatarFallback>{user.name ? user.name.substring(0,1).toUpperCase() : 'U'}</AvatarFallback>
                                </ShadcnAvatar>
                                <div>
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.emailId}</p>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-base mb-2 block">Selected Team Members ({selectedUsers.length})</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto p-1 border rounded-md dark:border-slate-700">
                  {selectedUsers.map(user => (
                    <div key={user.emailId} className={`flex items-center justify-between p-2 rounded-md ${props.isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                      <div className="flex items-center">
                        <ShadcnAvatar className="h-8 w-8 mr-3">
                          <AvatarImage src={user.profilePic} alt={user.name} />
                           <AvatarFallback>{user.name ? user.name.substring(0,1).toUpperCase() : 'U'}</AvatarFallback>
                        </ShadcnAvatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{user.emailId}</p>
                        </div>
                      </div>
                      {user.emailId !== props.userDetail.emailId && (
                        <Button variant="ghost" size="sm" onClick={() => handleUserRemove(user.emailId)} className="text-red-500 hover:text-red-600">
                          Remove
                        </Button>
                      )}
                       {user.emailId === props.userDetail.emailId && (
                         <Badge variant="secondary" className="text-xs">Owner</Badge>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 flex flex-row justify-between sm:justify-between w-full">
          {currentPage === 0 ? (
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          ) : (
            <Button variant="outline" onClick={handlePrev}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
          )}

          {currentPage === 0 ? (
            <Button onClick={handleNext}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Create Project
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTeamPage;
