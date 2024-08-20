# Chat with PDF AI

Welcome to the **Chat with PDF AI** repository, a powerful tool that allows users to interact with PDF documents using AI, providing insights and answers to your queries based on the document's content.
https://file-chat-ai.vercel.app/

[[Demo Video](https://www.loom.com/share/3564a3eb97fd403baf1e3ae76f544893?sid=8f30dc17-a154-46fd-8991-66bde1cab7fe)]

## Features

- **Chat with PDFs**: Upload a PDF document and ask questions directly to the document. The AI will provide context-based answers.
- **User Authentication**: Integrated with Clerk for easy user authentication and session management.
- **Real-Time Chat**: Powered by OpenAI for natural and responsive interaction.
- **Subscriptions**: Users can unlock additional features with a subscription plan.
- **File Storage**: Secure file handling via AWS S3.
- **Stripe Integration**: Payment and subscription management powered by Stripe.

## System Diagram
![image](https://github.com/user-attachments/assets/f17112f3-e5fe-441b-9b6b-6a616bdae98c)

  
## Tech Stack

- **Framework**: [Next.js] for the core application.
- **Database**: [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) for database management.
- **Authentication**: [Clerk](https://clerk.dev/) for handling user sessions and security.
- **AI Integration**: OpenAI and LangChain for AI-driven interactions.
- **Cloud Storage**: AWS S3 for storing and retrieving PDFs.
- **Payment Processing**: Stripe for managing user subscriptions.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for responsive and modern UI styling.

## Usage

1. Upload your PDF file via the provided UI.
2. Once uploaded, ask any questions based on the document content.
3. The AI will respond with relevant information based on the context from the uploaded PDF.
4. Subscription plans offer enhanced capabilities for premium users.

