# Architecture & Design Decisions

The "AI Life Admin Assistant" backend is engineered with a rigorous separation of concerns to support isolated scaling and clean enterprise-readiness. Below are the structural paradigms implemented.

## 1. Domain-Driven Architecture
- **Controllers Phase (`/controllers`)**: Manages input/output boundaries cleanly, parsing incoming HTTP REST streams and delegating specific business logic payloads seamlessly.
- **Service Layer (`/services`)**: Completely isolates business logic. For example, `extractTextService` handles pure Tesseract OCR bridging without database knowledge; `taskParserService` handles external OpenAI API inferences.
- **Repository Pattern (`/repository`)**: Isolates raw Supabase SDK queries. By keeping `taskRepository` abstracted, we could feasibly swap PostgreSQL entirely without alerting the Service or Controller layers.

## 2. Security & Form Validation
- Standard forms are bound via **Joi Validation Middleware**. In strict environments, protecting against malicious API inputs dynamically reduces downstream exception traces.
- File interceptors heavily restrict binary streams to accepted MimeTypes (Image/PDF) strictly preventing malicious payload injections (`MAX_FILE_SIZE_MB` boundaries).

## 3. Future-Ready Stubs
* **Multi-user Constraints**: The Schema injects `user_id` mapped keys for an eventual Row-Level Security rollout.
* **Asynchronous Queue Designs**: Upload throughput blocks the main thread in a simplified Express architecture. For massive scale, `uploadController` should dispatch OCR tasks to BullMQ (Redis) workers to prevent request timeouts.

## 4. Generic Response Standard
Every module enforces the `{ success, data, message }` payload response format wrapped by an automated error-catcher layout middleware.
