import React, { useState } from "react";
import { motion } from "framer-motion";
import { pageVariants, smoothTransition } from "@/lib/transitions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { 
  ButtonGroup, 
  ButtonGroupText, 
  ButtonGroupSeparator 
} from "@/components/ui/button-group";
import { 
  InputGroup, 
  InputGroupAddon, 
  InputGroupInput, 
  InputGroupButton, 
  InputGroupText,
  InputGroupTextarea
} from "@/components/ui/input-group";
import { 
  Field, 
  FieldLabel, 
  FieldDescription, 
  FieldError,
  FieldGroup,
  FieldContent,
  FieldTitle
} from "@/components/ui/field";
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
  ItemHeader,
  ItemFooter
} from "@/components/ui/item";
import { SearchIcon, PlusIcon, SendIcon, CheckIcon, XIcon } from "lucide-react";

const ShadcnComponentsDemo = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={smoothTransition}
      className="container mx-auto py-8 space-y-12"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Shadcn UI Components Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the usage of newly installed shadcn UI components.
        </p>
      </div>

      {/* Spinner Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Spinner Component</h2>
        <div className="flex items-center gap-4">
          <Spinner />
          <Spinner className="size-6 text-primary" />
          <Spinner className="size-8 text-destructive" />
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? <Spinner className="mr-2" /> : null}
            {loading ? "Loading..." : "Click to load"}
          </Button>
        </div>
      </section>

      {/* Kbd Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Keyboard (Kbd) Component</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            Press <Kbd>Tab</Kbd> to navigate
          </div>
          <div className="flex items-center gap-2">
            Press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to copy
          </div>
          <div className="flex items-center gap-2">
            Press <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>Shift</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup> to open command palette
          </div>
        </div>
      </section>

      {/* Button Group Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Group Component</h2>
        <div className="space-y-4">
          <ButtonGroup>
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="outline">
              <CheckIcon className="size-4" />
              Accept
            </Button>
            <Button variant="outline">
              <XIcon className="size-4" />
              Reject
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
            <Button variant="outline">Year</Button>
          </ButtonGroup>

          <ButtonGroup>
            <ButtonGroupText>Filter by:</ButtonGroupText>
            <ButtonGroupSeparator />
            <Button variant="outline">Recent</Button>
            <Button variant="outline">Popular</Button>
          </ButtonGroup>
        </div>
      </section>

      {/* Input Group Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input Group Component</h2>
        <div className="space-y-4 max-w-md">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon className="size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
          </InputGroup>

          <InputGroup>
            <InputGroupAddon>Email</InputGroupAddon>
            <InputGroupInput 
              type="email" 
              placeholder="example@cequens.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <InputGroupInput placeholder="Add a tag..." />
            <InputGroupAddon align="inline-end">
              <InputGroupButton>
                <PlusIcon className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <InputGroup>
            <InputGroupTextarea 
              placeholder="Type your message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton>
                <SendIcon className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </section>

      {/* Field Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Field Component</h2>
        <div className="space-y-6 max-w-md">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupInput id="name" placeholder="John Doe" />
                </InputGroup>
                <FieldDescription>Enter your full name as it appears on your ID.</FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupInput id="email" type="email" placeholder="john@example.com" />
                </InputGroup>
                <FieldDescription>We'll never share your email with anyone else.</FieldDescription>
                <FieldError>Please enter a valid email address.</FieldError>
              </FieldContent>
            </Field>

            <Field orientation="horizontal">
              <FieldTitle>Notifications</FieldTitle>
              <FieldContent>
                <InputGroup>
                  <Button variant="outline" size="sm">Enable</Button>
                  <Button variant="outline" size="sm">Disable</Button>
                </InputGroup>
                <FieldDescription>Receive notifications about account activity.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>
      </section>

      {/* Item Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Item Component</h2>
        <div className="space-y-4 max-w-md">
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <SearchIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Search Results</ItemTitle>
                <ItemDescription>View and manage your search history and results.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="sm">View</Button>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item>
              <ItemMedia variant="icon">
                <PlusIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>New Campaign</ItemTitle>
                <ItemDescription>Create a new marketing campaign for your business.</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="sm">Create</Button>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item variant="outline">
              <ItemHeader>
                <ItemTitle>Featured Item</ItemTitle>
                <Button variant="ghost" size="sm">Pin</Button>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>This is a featured item with header and footer sections.</ItemDescription>
              </ItemContent>
              <ItemFooter>
                <span className="text-xs text-muted-foreground">Updated 2 hours ago</span>
                <Button variant="ghost" size="sm">Details</Button>
              </ItemFooter>
            </Item>
          </ItemGroup>
        </div>
      </section>
    </motion.div>
  );
};

export default ShadcnComponentsDemo;