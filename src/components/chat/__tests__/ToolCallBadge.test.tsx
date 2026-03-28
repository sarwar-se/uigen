import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolCallLabel unit tests ---

test("getToolCallLabel: str_replace_editor create shows Creating <filename>", () => {
  expect(
    getToolCallLabel("str_replace_editor", { command: "create", path: "/src/App.jsx" })
  ).toBe("Creating App.jsx");
});

test("getToolCallLabel: str_replace_editor str_replace shows Editing <filename>", () => {
  expect(
    getToolCallLabel("str_replace_editor", { command: "str_replace", path: "/src/components/Button.tsx" })
  ).toBe("Editing Button.tsx");
});

test("getToolCallLabel: str_replace_editor insert shows Editing <filename>", () => {
  expect(
    getToolCallLabel("str_replace_editor", { command: "insert", path: "/src/App.jsx" })
  ).toBe("Editing App.jsx");
});

test("getToolCallLabel: str_replace_editor view shows Reading <filename>", () => {
  expect(
    getToolCallLabel("str_replace_editor", { command: "view", path: "/src/App.jsx" })
  ).toBe("Reading App.jsx");
});

test("getToolCallLabel: str_replace_editor undo_edit shows Undoing edit in <filename>", () => {
  expect(
    getToolCallLabel("str_replace_editor", { command: "undo_edit", path: "/src/App.jsx" })
  ).toBe("Undoing edit in App.jsx");
});

test("getToolCallLabel: str_replace_editor unknown command shows Updating <filename>", () => {
  expect(
    getToolCallLabel("str_replace_editor", { command: "unknown", path: "/src/App.jsx" })
  ).toBe("Updating App.jsx");
});

test("getToolCallLabel: str_replace_editor no path falls back to generic message", () => {
  expect(getToolCallLabel("str_replace_editor", { command: "create" })).toBe("Creating file");
  expect(getToolCallLabel("str_replace_editor", { command: "str_replace" })).toBe("Editing file");
});

test("getToolCallLabel: str_replace_editor no args falls back to Updating file", () => {
  expect(getToolCallLabel("str_replace_editor", {})).toBe("Updating file");
});

test("getToolCallLabel: file_manager rename shows Renaming <from> to <to>", () => {
  expect(
    getToolCallLabel("file_manager", {
      command: "rename",
      path: "/src/App.jsx",
      new_path: "/src/Main.jsx",
    })
  ).toBe("Renaming App.jsx to Main.jsx");
});

test("getToolCallLabel: file_manager delete shows Deleting <filename>", () => {
  expect(
    getToolCallLabel("file_manager", { command: "delete", path: "/src/App.jsx" })
  ).toBe("Deleting App.jsx");
});

test("getToolCallLabel: file_manager rename without new_path falls back", () => {
  expect(
    getToolCallLabel("file_manager", { command: "rename", path: "/src/App.jsx" })
  ).toBe("Renaming file");
});

test("getToolCallLabel: file_manager no path falls back to generic message", () => {
  expect(getToolCallLabel("file_manager", { command: "delete" })).toBe("Deleting file");
});

test("getToolCallLabel: unknown tool returns toolName", () => {
  expect(getToolCallLabel("some_other_tool", { command: "run" })).toBe("some_other_tool");
});

// --- ToolCallBadge render tests ---

test("ToolCallBadge renders friendly label for str_replace_editor create", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/App.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("ToolCallBadge renders friendly label for str_replace_editor str_replace", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/src/Card.tsx" }}
      state="result"
      result="Success"
    />
  );
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("ToolCallBadge renders friendly label for file_manager delete", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/src/Old.tsx" }}
      state="result"
      result={{ success: true }}
    />
  );
  expect(screen.getByText("Deleting Old.tsx")).toBeDefined();
});

test("ToolCallBadge renders friendly label for file_manager rename", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "rename", path: "/src/App.jsx", new_path: "/src/Main.jsx" }}
      state="result"
      result={{ success: true }}
    />
  );
  expect(screen.getByText("Renaming App.jsx to Main.jsx")).toBeDefined();
});

test("ToolCallBadge shows green dot when state is result with result", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/App.jsx" }}
      state="result"
      result="Success"
    />
  );
  const dot = container.querySelector(".bg-emerald-500");
  expect(dot).toBeDefined();
  expect(dot).not.toBeNull();
});

test("ToolCallBadge shows spinner when state is not result", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/App.jsx" }}
      state="call"
    />
  );
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
  expect(spinner).not.toBeNull();
  const dot = container.querySelector(".bg-emerald-500");
  expect(dot).toBeNull();
});

test("ToolCallBadge shows spinner when result is undefined even if state is result", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/App.jsx" }}
      state="result"
      result={undefined}
    />
  );
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).not.toBeNull();
});
