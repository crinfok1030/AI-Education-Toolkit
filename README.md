# AI Education Toolkit

**AI Education Toolkit** is a collection of AI‑powered tools, Chrome extensions, and practical examples for **language learning** and **exam preparation**.  
It is primarily a **code and assets hub** for products and experiments you run in your own ecosystem, not an open‑source project.

The toolkit will keep growing over time and is designed to support multiple exams, skills, and use cases, rather than being limited to a single product.

---

## Project Scope

AI Education Toolkit is intended to:

- Power and document **Chrome Web Store extensions** related to language learning and test prep  
- Centralize **internal scripts, configurations, and assets** used across your products  
- Provide **reusable patterns** for:
  - Writing and speaking practice
  - Automated feedback and scoring
  - Question generation and mock tests

It is focused on, but not limited to:

- Standardized exam preparation (e.g. Duolingo English Test, IELTS, and others)
- Daily language practice and writing improvement
- Future AI‑enhanced education products you decide to build

---

## Types of Tools in This Toolkit

### 1. Chrome Extensions (Chrome Web Store)

This repository will host the code and assets for multiple Chrome extensions, such as:

- Extensions that assist with **writing and speaking practice** directly inside the browser  
- Page‑level tools that:
  - Highlight or correct language issues
  - Generate explanations, examples, and practice questions
  - Help users interact with exam‑style tasks while browsing

Each extension can have its own folder/branch with:

- Manifest files and extension code
- UI components and content scripts
- Configuration files for model prompts and behavior

---

### 2. Language Learning & Exam Utilities

The toolkit can also include internal utilities such as:

- Scripts for generating or organizing **question banks**
- Logic for building **mock tests** and **adaptive practice flows**
- Functions for:
  - Draft evaluation and feedback (writing/speaking)
  - Score estimation based on exam‑style rubrics
  - Report generation and progress tracking

These components are intended to be used by your own products and services and are not meant as general‑purpose open‑source libraries.

---

### 3. Prompt and Configuration Templates

To keep behavior consistent across tools, this repo may store:

- **Prompt templates** for different tasks and exams  
- Rubrics and scoring criteria for:
  - Writing (task‑based or free writing)
  - Speaking (fluency, accuracy, coherence, etc.)
- Configuration files (JSON/YAML or similar) that define:
  - Skill focus (reading, listening, speaking, writing)
  - Difficulty levels and learning paths
  - Feedback style and level of detail

These templates can be reused across your website, extensions, and any future applications.

---

## Relationship with Existing Products

This toolkit supports and is informed by your existing products and platforms, for example:

- **DET Practice – Duolingo English Test preparation platform**  
  <https://www.detpractice.com/>

- **IELTS Writing AI – IELTS Writing practice and feedback**  
  <http://ieltswriting.ai/>

The repository is used to organize and maintain the underlying logic, assets, and experiments that help power or inspire such products, as well as future tools you may launch.

---

## Branches and Structure

You can organize this repository by branches or directories, for example:

- `main`  
  High‑level documentation, shared assets, and common utilities.

- `Duolingo-English-Test-Practice-Toolkit`  
  Resources and code specifically related to Duolingo English Test practice logic.

- `IELTS-Writing-Extension`  
  Code and assets for IELTS‑focused browser extensions and tools.

Additional branches or folders can be added for:

- New exams (TOEFL, PTE, etc.)
- Generic writing or speaking assistants
- Teacher‑oriented dashboards or helper tools

---

## Intended Audience

Although the code itself is not open‑sourced for public reuse, the structure and documentation are designed with several audiences in mind:

- **Internal developers / product teams**  
  To quickly build, update, and maintain educational AI tools and extensions.

- **Content and curriculum designers**  
  To align question types, rubrics, and feedback styles across different products.

- **Partners and collaborators**  
  To understand the capabilities and direction of your AI education ecosystem.

---

## Licensing & Access

This repository is **not open source**.  
All code, prompts, and assets are proprietary and intended for internal or controlled use only.  
Access and reuse are governed by your own internal policies and any agreements you set with partners or contributors.
