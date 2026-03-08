"""
Food Delivery Project - University Report PDF Generator

Sections:
  1.  Introduction
  2.  Project Objective
  3.  System Architecture
  4.  Technology Stack
  5.  Modules
  6.  Algorithms Used
  7.  Database Design
  8.  Code Structure
  9.  GitHub Development Timeline
  10. Testing
  11. Future Improvements
"""

import os
from fpdf import FPDF
from datetime import datetime


class ReportPDF(FPDF):
    # ── colours ──────────────────────────────────────────────────
    ORANGE = (255, 100, 0)
    DARK = (30, 30, 30)
    GRAY = (100, 100, 100)
    LIGHT_BG = (250, 247, 243)
    WHITE = (255, 255, 255)
    SECTION_BG = (255, 245, 235)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*self.GRAY)
        self.cell(0, 8, "Food Delivery Platform - University Project Report", align="L")
        self.cell(0, 8, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*self.ORANGE)
        self.set_line_width(0.5)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(*self.GRAY)
        self.cell(0, 10, f"Generated on {datetime.now().strftime('%B %d, %Y')}",
                  align="C")

    # ── helpers ──────────────────────────────────────────────────
    def section_title(self, number, title):
        self.ln(6)
        self.set_fill_color(*self.SECTION_BG)
        self.set_draw_color(*self.ORANGE)
        self.set_font("Helvetica", "B", 15)
        self.set_text_color(*self.ORANGE)
        x = self.get_x()
        y = self.get_y()
        self.rect(x, y, 190, 11, style="DF")
        self.set_xy(x + 3, y + 1)
        self.cell(0, 9, f"{number}.  {title}")
        self.ln(14)

    def sub_title(self, text):
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*self.DARK)
        self.cell(0, 8, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def body_text(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        self.multi_cell(0, 6, text)
        self.ln(2)

    def bullet(self, text, indent=15):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        self.set_x(self.l_margin + indent)
        self.cell(5, 6, "-")
        self.multi_cell(0, 6, text)

    def table(self, headers, rows, col_widths=None):
        if col_widths is None:
            col_widths = [190 // len(headers)] * len(headers)
        # header row
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(*self.ORANGE)
        self.set_text_color(*self.WHITE)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 8, h, border=1, fill=True, align="C")
        self.ln()
        # data rows
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*self.DARK)
        fill = False
        for row in rows:
            if self.get_y() > 265:
                self.add_page()
            if fill:
                self.set_fill_color(*self.LIGHT_BG)
            else:
                self.set_fill_color(*self.WHITE)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 7, str(cell), border=1, fill=True, align="C")
            self.ln()
            fill = not fill
        self.ln(3)


def build_report():
    pdf = ReportPDF("P", "mm", "A4")
    pdf.set_auto_page_break(auto=True, margin=20)

    # ════════════════════════════════════════════════════════════
    # COVER PAGE
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.ln(45)
    pdf.set_font("Helvetica", "B", 36)
    pdf.set_text_color(*ReportPDF.ORANGE)
    pdf.cell(0, 15, "Food Delivery Platform", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 18)
    pdf.set_text_color(*ReportPDF.DARK)
    pdf.cell(0, 12, "University Project Report", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    pdf.set_draw_color(*ReportPDF.ORANGE)
    pdf.set_line_width(1)
    pdf.line(60, pdf.get_y(), 150, pdf.get_y())
    pdf.ln(12)
    pdf.set_font("Helvetica", "", 13)
    pdf.set_text_color(*ReportPDF.GRAY)
    lines = [
        "Architecture:   MERN Stack  (MongoDB · Express · React · Node.js)",
        "Pattern:           Object-Oriented Programming (OOP)",
        f"Date:               {datetime.now().strftime('%B %d, %Y')}",
        "Version:           1.0.0",
    ]
    for line in lines:
        pdf.cell(0, 9, line, align="C", new_x="LMARGIN", new_y="NEXT")

    # ════════════════════════════════════════════════════════════
    # TABLE OF CONTENTS
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(*ReportPDF.ORANGE)
    pdf.cell(0, 12, "Table of Contents", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    toc = [
        ("1", "Introduction"),
        ("2", "Project Objective"),
        ("3", "System Architecture"),
        ("4", "Technology Stack"),
        ("5", "Modules"),
        ("6", "Algorithms Used"),
        ("7", "Database Design"),
        ("8", "Code Structure"),
        ("9", "GitHub Development Timeline"),
        ("10", "Testing"),
        ("11", "Future Improvements"),
    ]
    for num, title in toc:
        pdf.set_font("Helvetica", "", 12)
        pdf.set_text_color(*ReportPDF.DARK)
        pdf.cell(12, 8, num + ".")
        pdf.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # ════════════════════════════════════════════════════════════
    # 1. INTRODUCTION
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("1", "Introduction")
    pdf.body_text(
        "The Food Delivery Platform is a full-stack web application developed as a university "
        "project to demonstrate modern software engineering principles in a real-world scenario. "
        "The system replicates the core functionality of contemporary food delivery services "
        "such as Uber Eats and DoorDash, providing a seamless experience for customers, "
        "restaurant administrators, and delivery tracking."
    )
    pdf.body_text(
        "The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) "
        "and strictly adheres to Object-Oriented Programming (OOP) principles throughout every "
        "layer of the codebase. Industry-standard design patterns - including Singleton, "
        "Repository, Strategy, Factory, Observer, Adapter, and Dependency Injection - are "
        "deliberately applied to demonstrate software design best practices."
    )
    pdf.body_text(
        "The platform consists of three independent sub-applications that share a common "
        "RESTful backend API:"
    )
    pdf.bullet("Customer Frontend - A React 19 SPA for browsing menus, managing a shopping cart, "
               "and placing and tracking orders.")
    pdf.bullet("Admin Panel - A React 18 dashboard for managing food inventory, viewing orders, "
               "updating order statuses, and reviewing analytics.")
    pdf.bullet("Backend API - A Node.js / Express server with MongoDB persistence, JWT "
               "authentication, Stripe payment processing, and email notifications.")
    pdf.ln(3)
    pdf.body_text(
        "This report documents the complete architecture, design decisions, algorithms, database "
        "schema, development timeline, testing approach, and planned future improvements "
        "for the Food Delivery Platform project."
    )

    # ════════════════════════════════════════════════════════════
    # 2. PROJECT OBJECTIVE
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("2", "Project Objective")
    pdf.body_text(
        "The primary objectives of the Food Delivery Platform project are:"
    )

    pdf.sub_title("2.1 Academic Objectives")
    pdf.bullet("Demonstrate proficiency in full-stack web development using the MERN stack.")
    pdf.bullet("Apply Object-Oriented Programming principles throughout all application layers.")
    pdf.bullet("Implement and document industry-standard software design patterns.")
    pdf.bullet("Practise separation of concerns through a clear layered architecture.")
    pdf.bullet("Integrate third-party services (Stripe, Firebase, Nodemailer) into a cohesive system.")
    pdf.bullet("Write and maintain automated unit tests for UI components.")

    pdf.ln(3)
    pdf.sub_title("2.2 Functional Objectives")
    pdf.bullet("Allow customers to browse food items by category and search by keyword.")
    pdf.bullet("Provide a persistent shopping cart that synchronises with the backend for logged-in users.")
    pdf.bullet("Enable secure checkout with Stripe's hosted payment page and cash-on-delivery option.")
    pdf.bullet("Track order lifecycle through three statuses: Food Processing, Out for Delivery, Delivered.")
    pdf.bullet("Support user registration and login via email/password and social login (Google, Facebook).")
    pdf.bullet("Allow administrators to manage the food catalogue (add, list, remove items).")
    pdf.bullet("Send email notifications to customers when their order status changes.")
    pdf.bullet("Provide an admin analytics dashboard showing orders, revenue, and status breakdown.")

    pdf.ln(3)
    pdf.sub_title("2.3 Non-Functional Objectives")
    pdf.bullet("Security - JWT authentication, bcrypt password hashing, API rate limiting.")
    pdf.bullet("Scalability - Stateless REST API; MongoDB horizontal scaling support.")
    pdf.bullet("Maintainability - OOP classes, single responsibility, dependency injection.")
    pdf.bullet("Usability - Responsive design, smooth animations, toast notifications.")
    pdf.bullet("Testability - Component-level unit tests with Vitest and Testing Library.")

    # ════════════════════════════════════════════════════════════
    # 3. SYSTEM ARCHITECTURE
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("3", "System Architecture")
    pdf.body_text(
        "The system follows a three-tier client-server architecture with clear separation of "
        "presentation, application, and data concerns."
    )

    pdf.sub_title("3.1 Architecture Diagram")
    pdf.set_font("Courier", "", 9)
    diagram = (
        "+---------------------+     +---------------------+\n"
        "|  Customer Frontend  |     |    Admin Panel       |\n"
        "|  (React 19 + Vite)  |     |  (React 18 + Vite)  |\n"
        "+----------+----------+     +----------+----------+\n"
        "           |                           |\n"
        "           +--------+    +-------------+\n"
        "                    |    |\n"
        "              +-----v----v------+\n"
        "              |  Backend API    |\n"
        "              | (Express + OOP) |\n"
        "              +-----+----------+\n"
        "                    |\n"
        "        +-----------+-----------+\n"
        "        |           |           |\n"
        "   +----v---+  +----v----+ +----v-----+\n"
        "   |MongoDB |  | Stripe  | | Firebase |\n"
        "   +--------+  +---------+ +----------+\n"
    )
    for line in diagram.split("\n"):
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("3.2 Presentation Tier")
    pdf.body_text(
        "Two React SPAs communicate with the backend exclusively via RESTful HTTP APIs using "
        "Axios. Each application has its own Vite build pipeline and is independently deployable. "
        "Framer Motion provides animated page transitions in the customer frontend."
    )

    pdf.sub_title("3.3 Application Tier")
    pdf.body_text(
        "The Express.js server is the single entry point for all API requests. It is structured "
        "using OOP classes following the layered pattern: Routes -> Controllers -> Services -> "
        "Models. Each layer has a single responsibility, and cross-cutting concerns (auth, "
        "file upload, rate limiting) are handled by middleware."
    )

    pdf.sub_title("3.4 Data Tier")
    pdf.body_text(
        "MongoDB (via Mongoose ODM) persists three collections: users, foods, and orders. "
        "Stripe handles payment session creation and verification. Firebase Authentication "
        "provides OAuth 2.0 social login. Nodemailer delivers transactional emails via SMTP."
    )

    pdf.sub_title("3.5 Communication Flow")
    pdf.table(
        ["Step", "Actor", "Action"],
        [
            ["1", "Customer", "Browses menu; React fetches GET /api/food/list"],
            ["2", "Customer", "Adds to cart; React calls POST /api/cart/add (JWT required)"],
            ["3", "Customer", "Places order; backend creates Stripe session, returns URL"],
            ["4", "Stripe", "Redirects to /verify after payment; backend updates order"],
            ["5", "Admin", "Views orders; React fetches GET /api/order/list"],
            ["6", "Admin", "Updates status; POST /api/order/status; EmailService notifies customer"],
        ],
        [10, 25, 155],
    )

    # ════════════════════════════════════════════════════════════
    # 4. TECHNOLOGY STACK
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("4", "Technology Stack")

    pdf.sub_title("4.1 Backend")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["Node.js", "v16+", "JavaScript runtime environment"],
            ["Express.js", "4.18", "HTTP server and routing framework"],
            ["MongoDB", "v5+", "NoSQL document database"],
            ["Mongoose", "8.1", "Object Document Mapper (ODM) for MongoDB"],
            ["Stripe", "14.14", "Payment processing and checkout sessions"],
            ["JSON Web Token", "9.0", "Stateless authentication tokens"],
            ["bcryptjs", "2.4", "Password hashing and verification"],
            ["Multer", "1.4", "Multipart form / file upload middleware"],
            ["Nodemailer", "8.0", "Transactional email delivery via SMTP"],
            ["express-rate-limit", "7.5", "API rate limiting per IP"],
            ["validator", "13.11", "Email and input validation"],
            ["dotenv", "16.4", "Environment variable configuration"],
            ["Nodemon", "3.0", "Development server with hot-reload"],
        ],
        [55, 25, 110],
    )

    pdf.sub_title("4.2 Customer Frontend")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["React", "19.2", "Component-based UI library"],
            ["React Router DOM", "7.12", "Client-side routing and navigation"],
            ["Vite", "7.2", "Fast build tool and development server"],
            ["Axios", "1.13", "Promise-based HTTP client"],
            ["Firebase", "12.9", "Google / Facebook social authentication"],
            ["Framer Motion", "12.29", "Declarative animations and page transitions"],
            ["React Toastify", "11.0", "In-app toast notification system"],
            ["Vitest", "4.0", "Unit and component testing framework"],
            ["Testing Library", "16.3", "User-centric component testing utilities"],
        ],
        [55, 25, 110],
    )

    pdf.sub_title("4.3 Admin Panel")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["React", "18.2", "Component-based UI library"],
            ["React Router DOM", "6.18", "Client-side routing and navigation"],
            ["Vite", "4.5", "Build tool and development server"],
            ["Axios", "1.6", "HTTP client for API communication"],
            ["React Toastify", "9.1", "Toast notification system"],
            ["Vitest", "0.34", "Unit and component testing framework"],
            ["Testing Library", "14.0", "Component testing utilities"],
        ],
        [55, 25, 110],
    )

    # ════════════════════════════════════════════════════════════
    # 5. MODULES
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("5", "Modules")

    pdf.sub_title("5.1 Backend Modules")
    pdf.body_text(
        "The backend is divided into six functional modules, each implemented as OOP classes:"
    )
    pdf.table(
        ["Module", "Files", "Responsibility"],
        [
            ["Config", "Database.js", "Singleton MongoDB connection management"],
            ["Models", "UserModel, FoodModel, OrderModel",
             "Mongoose schemas with CRUD helper methods"],
            ["Controllers", "UserController, FoodController, CartController, OrderController",
             "HTTP request handling; delegates to services"],
            ["Services", "UserService, FoodService, CartService, OrderService, StripeService, EmailService",
             "All business logic and third-party integrations"],
            ["Routes", "UserRoute, FoodRoute, CartRoute, OrderRoute",
             "HTTP verb to controller method mapping"],
            ["Middleware", "AuthMiddleware, FileUploadMiddleware",
             "JWT verification and Multer file upload"],
        ],
        [25, 55, 110],
    )

    pdf.sub_title("5.2 Customer Frontend Modules")
    pdf.table(
        ["Module", "Key Files", "Responsibility"],
        [
            ["Pages", "Home, Menu, Cart, PlaceOrder, Verify, MyOrders",
             "Route-level views for each user workflow"],
            ["Components", "Navbar, FoodDisplay, FoodItem, Login, ExploreMenu, ...",
             "Reusable UI building blocks"],
            ["Context", "StoreContext.jsx",
             "Global state: food list, cart, auth token"],
            ["Services", "authService.js",
             "Firebase OAuth flow and backend JWT sync"],
            ["Adapters", "RepositoryAdapter.js",
             "Adapter pattern for swappable data sources"],
            ["Firebase", "firebaseConfig.js",
             "Firebase app initialisation and auth provider setup"],
        ],
        [25, 55, 110],
    )

    pdf.sub_title("5.3 Admin Panel Modules")
    pdf.table(
        ["Module", "Key Files", "Responsibility"],
        [
            ["Pages", "Dashboard, Add, List, Orders",
             "Admin views for analytics and management"],
            ["Components", "Navbar, Sidebar",
             "Admin layout components"],
            ["Services", "ApiService.js",
             "Singleton Axios client with interceptors"],
            ["Repositories", "FoodRepository, OrderRepository",
             "Abstracted HTTP data access layer"],
            ["Models", "models/index.js",
             "Domain classes: Order, FoodItem, Address, DashboardStats"],
            ["Strategies", "OrderFilterStrategy.js",
             "Strategy pattern for order time-period filtering"],
            ["Factories", "FoodFormFactory.js",
             "Factory for immutable food form data objects"],
            ["Events", "EventBus.js",
             "Observer / publish-subscribe decoupling mechanism"],
        ],
        [25, 55, 110],
    )

    # ════════════════════════════════════════════════════════════
    # 6. ALGORITHMS USED
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("6", "Algorithms Used")

    pdf.sub_title("6.1 Password Hashing - bcrypt")
    pdf.body_text(
        "User passwords are never stored in plain text. The bcryptjs library implements the "
        "bcrypt adaptive hashing algorithm. A salt round factor of 10 is used, meaning 2^10 "
        "iterations of the Blowfish cipher are applied. The salt is randomly generated per "
        "password, preventing rainbow-table attacks. On login, bcrypt.compare() runs the "
        "same algorithm on the submitted password and compares it to the stored hash in "
        "constant time, preventing timing attacks."
    )

    pdf.sub_title("6.2 JWT Token Generation and Verification")
    pdf.body_text(
        "Authentication tokens are generated using the HMAC-SHA256 (HS256) algorithm via the "
        "jsonwebtoken library. The payload contains the user ID. The token is signed with a "
        "secret key stored in environment variables and has a 7-day expiry. On each protected "
        "request, the AuthMiddleware decodes and verifies the token signature and checks the "
        "expiry claim before allowing access."
    )

    pdf.sub_title("6.3 Full-Text Search - MongoDB Text Index")
    pdf.body_text(
        "The Food collection has a compound text index on the name, description, and category "
        "fields. When a search query is submitted, MongoDB's $text operator uses an inverted "
        "index to find matching documents. Results are scored by relevance using TF-IDF "
        "(term frequency-inverse document frequency) weighting. The query is case-insensitive "
        "and stop-word filtered."
    )

    pdf.sub_title("6.4 Shopping Cart Aggregation")
    pdf.body_text(
        "The cart is stored as a map (object) in the User document: { foodId: quantity }. "
        "To compute the cart total, the frontend iterates over all cart entries, looks up "
        "the price of each food item from the global food list, and accumulates the sum "
        "(O(n) linear scan). Items with quantity zero are excluded from the display."
    )

    pdf.sub_title("6.5 Order Filtering - Strategy Pattern")
    pdf.body_text(
        "The admin panel filters orders by time period using interchangeable strategy objects. "
        "Each strategy (AllTimeStrategy, TodayStrategy, WeekStrategy, MonthStrategy, "
        "YearStrategy) implements a filter(orders) method. The Order domain model's "
        "isWithin(period) helper computes whether the order date falls within the requested "
        "window by comparing Unix timestamps. Adding a new period requires implementing "
        "one new strategy class with zero changes to existing code."
    )

    pdf.sub_title("6.6 Dashboard Statistics Aggregation")
    pdf.body_text(
        "The DashboardStats class computes analytics over the filtered order list in a single "
        "pass (O(n)): total order count, total revenue (sum of order amounts), and counts of "
        "orders in each status bucket (Food Processing, Out for Delivery, Delivered). The "
        "formattedRevenue getter formats the monetary value as a localised currency string."
    )

    pdf.sub_title("6.7 Stripe Payment Session Creation")
    pdf.body_text(
        "When a customer places an order, the StripeService maps each cart item to a Stripe "
        "line-item object (name, price in cents, quantity). A fixed delivery fee line item "
        "of $2.00 is appended. The Stripe SDK then creates a hosted checkout session via "
        "the HTTPS API, returning a session URL. The frontend redirects the customer to "
        "this URL for secure card entry. After payment, Stripe calls the configured success "
        "or cancel redirect URL, and the backend verifies the session status."
    )

    # ════════════════════════════════════════════════════════════
    # 7. DATABASE DESIGN
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("7", "Database Design")
    pdf.body_text(
        "The application uses MongoDB, a document-oriented NoSQL database, accessed through "
        "the Mongoose ODM. Three collections store all application data."
    )

    pdf.sub_title("7.1 Entity-Relationship Overview")
    pdf.set_font("Courier", "", 9)
    er = (
        "  +----------+        +----------+        +-----------+\n"
        "  |   User   | 1    * |  Order   | *    * |   Food    |\n"
        "  |----------|--------|----------|--------|-----------||\n"
        "  | _id      |        | _id      |        | _id       |\n"
        "  | name     |        | userId   |        | name      |\n"
        "  | email    |        | items[]  |        | description|\n"
        "  | password |        | amount   |        | price     |\n"
        "  | cartData |        | address  |        | image     |\n"
        "  +----------+        | status   |        | category  |\n"
        "                      | payment  |        | isAvailable|\n"
        "                      | date     |        +-----------+\n"
        "                      +----------+\n"
    )
    for line in er.split("\n"):
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("7.2 User Collection")
    pdf.table(
        ["Field", "Type", "Constraints / Notes"],
        [
            ["_id", "ObjectId", "Auto-generated primary key"],
            ["name", "String", "Required"],
            ["email", "String", "Required, Unique, validated by validator lib"],
            ["password", "String", "Required, bcrypt hash"],
            ["cartData", "Object", "Default: {}  -  map of { foodId: quantity }"],
            ["resetPasswordToken", "String", "Optional, for password-reset flow"],
            ["resetPasswordExpire", "Date", "Optional, token expiry timestamp"],
            ["createdAt / updatedAt", "Date", "Auto-managed by Mongoose timestamps"],
        ],
        [45, 30, 115],
    )

    pdf.sub_title("7.3 Food Collection")
    pdf.table(
        ["Field", "Type", "Constraints / Notes"],
        [
            ["_id", "ObjectId", "Auto-generated primary key"],
            ["name", "String", "Required; part of text index"],
            ["description", "String", "Required; part of text index"],
            ["price", "Number", "Required; min: 0"],
            ["image", "String", "Required; filename of uploaded image"],
            ["category", "String", "Required; enum: Salad, Rolls, Deserts, Sandwich, Cake, Veg, Pasta, Noodles; part of text index"],
            ["isAvailable", "Boolean", "Default: true"],
            ["createdAt / updatedAt", "Date", "Auto-managed by Mongoose timestamps"],
        ],
        [45, 30, 115],
    )

    pdf.sub_title("7.4 Order Collection")
    pdf.table(
        ["Field", "Type", "Constraints / Notes"],
        [
            ["_id", "ObjectId", "Auto-generated primary key"],
            ["userId", "String", "Required; references User._id"],
            ["items", "Array", "Required; array of { name, quantity, _id (Food ref) }"],
            ["amount", "Number", "Required; total order value including delivery fee"],
            ["address", "Object", "Required; firstName, lastName, street, city, state, country, zipcode, phone"],
            ["status", "String", "Default: 'Food Processing'; enum: Food Processing, Out for Delivery, Delivered"],
            ["payment", "Boolean", "Default: false; true after Stripe verification"],
            ["date", "Date", "Default: Date.now"],
        ],
        [45, 30, 115],
    )

    pdf.sub_title("7.5 Indexes")
    pdf.table(
        ["Collection", "Index Type", "Fields", "Purpose"],
        [
            ["User", "Unique", "email", "Prevent duplicate registrations"],
            ["Food", "Text", "name, description, category", "Full-text search functionality"],
        ],
        [30, 25, 60, 75],
    )

    # ════════════════════════════════════════════════════════════
    # 8. CODE STRUCTURE
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("8", "Code Structure")
    pdf.body_text(
        "The repository is organised as a monorepo with three top-level sub-applications "
        "plus shared root configuration. Each sub-application is independently installable "
        "and runnable."
    )

    pdf.set_font("Courier", "", 8)
    structure = """Food-Del_upadated/
|-- package.json                     (Root config - concurrent dev scripts)
|-- generate_report.py               (This report generator)
|-- backend/
|   |-- package.json
|   |-- README.md
|   |-- src/
|   |   |-- server.js                (Server class - Express entry point)
|   |   |-- config/
|   |   |   +-- Database.js          (Singleton MongoDB connection)
|   |   |-- controllers/
|   |   |   |-- CartController.js    (Cart HTTP handlers)
|   |   |   |-- FoodController.js    (Food HTTP handlers)
|   |   |   |-- OrderController.js   (Order HTTP handlers)
|   |   |   +-- UserController.js    (User HTTP handlers)
|   |   |-- middleware/
|   |   |   |-- AuthMiddleware.js    (JWT token verification)
|   |   |   +-- FileUploadMiddleware.js  (Multer image upload)
|   |   |-- models/
|   |   |   |-- FoodModel.js         (Food schema + CRUD class)
|   |   |   |-- OrderModel.js        (Order schema + CRUD class)
|   |   |   +-- UserModel.js         (User schema + CRUD class)
|   |   |-- routes/
|   |   |   |-- CartRoute.js
|   |   |   |-- FoodRoute.js
|   |   |   |-- OrderRoute.js
|   |   |   +-- UserRoute.js
|   |   +-- services/
|   |       |-- CartService.js       (Cart business logic)
|   |       |-- EmailService.js      (Nodemailer email sending)
|   |       |-- FoodService.js       (Food business logic)
|   |       |-- OrderService.js      (Order + Stripe business logic)
|   |       |-- StripeService.js     (Stripe session creation)
|   |       +-- UserService.js       (Auth + profile business logic)
|   +-- uploads/                     (Food item images - served statically)
|-- frontend/
|   |-- package.json
|   |-- vite.config.mjs
|   |-- adapters/
|   |   +-- RepositoryAdapter.js     (Adapter pattern - swappable data source)
|   |-- src/
|   |   |-- App.jsx                  (Router + AnimatePresence wrapper)
|   |   |-- context/
|   |   |   +-- StoreContext.jsx     (Global state - food list, cart, token)
|   |   |-- services/
|   |   |   +-- authService.js       (Firebase OAuth + backend JWT sync)
|   |   |-- firebase/
|   |   |   +-- firebaseConfig.js    (Firebase app initialisation)
|   |   |-- components/              (14 reusable UI components)
|   |   +-- pages/                   (7 page-level components)
+-- admin/
    |-- package.json
    |-- vite.config.js
    +-- src/
        |-- App.jsx                  (Composition root + dependency injection)
        |-- services/
        |   +-- ApiService.js        (Singleton Axios client with interceptors)
        |-- repositories/
        |   |-- FoodRepository.js    (Food data access abstraction)
        |   +-- OrderRepository.js   (Order data access abstraction)
        |-- models/
        |   +-- index.js             (Order, FoodItem, Address, DashboardStats classes)
        |-- strategies/
        |   +-- OrderFilterStrategy.js  (Strategy pattern for time-period filtering)
        |-- factories/
        |   +-- FoodFormFactory.js   (Factory for food form data objects)
        |-- events/
        |   +-- EventBus.js          (Singleton pub/sub event bus)
        |-- components/              (Navbar, Sidebar)
        +-- pages/                   (Dashboard, Add, List, Orders)"""
    for line in structure.split("\n"):
        pdf.cell(0, 4, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*ReportPDF.DARK)
    pdf.cell(0, 8, "Design Patterns Summary", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)
    pdf.table(
        ["Pattern", "Where Applied", "Purpose"],
        [
            ["Singleton", "Backend models, services, DB config; Admin ApiService, EventBus",
             "Single shared instance across the application"],
            ["Repository", "Admin FoodRepository, OrderRepository",
             "Abstracts HTTP calls; components never touch raw Axios"],
            ["Strategy", "Admin OrderFilterStrategy",
             "Swappable time-period filters; Open/Closed Principle"],
            ["Factory", "Admin FoodFormFactory",
             "Centralised, immutable creation of form data objects"],
            ["Observer", "Admin EventBus",
             "Decoupled pub/sub communication between components"],
            ["Adapter", "Frontend RepositoryAdapter",
             "IRepository interface with interchangeable implementations"],
            ["Dependency Injection", "Admin App.jsx ServiceContext",
             "Services injected via React Context; no direct imports"],
            ["MVC / Layered", "Backend Routes-Controllers-Services-Models",
             "Single responsibility per layer; no cross-layer leakage"],
            ["Context", "Frontend StoreContext",
             "Global state without prop drilling"],
        ],
        [30, 65, 95],
    )

    # ════════════════════════════════════════════════════════════
    # 9. GITHUB DEVELOPMENT TIMELINE
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("9", "GitHub Development Timeline")
    pdf.body_text(
        "The project was developed iteratively on GitHub, with each commit representing a "
        "logical unit of work. The following timeline summarises the key development milestones "
        "in chronological order."
    )

    pdf.sub_title("9.1 Commit History")
    pdf.table(
        ["Date", "Commit", "Description"],
        [
            ["2026-03-08", "ce3df88", "Initial plan - project scaffolding and architecture outline"],
            ["2026-03-09", "c10cfd0", "Core implementation - MERN stack modules, OOP classes, and tests"],
        ],
        [30, 25, 135],
    )

    pdf.ln(3)
    pdf.sub_title("9.2 Development Phases")
    pdf.table(
        ["Phase", "Activities"],
        [
            ["Phase 1 - Planning",
             "Defined project scope, chose MERN stack, designed OOP class hierarchy, "
             "identified design patterns, created repository and initial plan commit."],
            ["Phase 2 - Backend Development",
             "Implemented Express server, MongoDB models (User, Food, Order), "
             "controllers, services, middleware (JWT auth, Multer upload), "
             "and all REST API endpoints."],
            ["Phase 3 - Frontend Development",
             "Built React customer SPA with pages (Home, Menu, Cart, Place Order, "
             "My Orders, Verify), StoreContext state management, and Firebase social login."],
            ["Phase 4 - Admin Panel",
             "Developed React admin dashboard with OOP patterns: Singleton ApiService, "
             "Repository layer, Strategy filters, Factory form builder, Observer EventBus, "
             "and rich domain models."],
            ["Phase 5 - Integration & Testing",
             "Connected frontend to backend API, integrated Stripe payments and "
             "Nodemailer emails, wrote 10 Vitest component unit tests."],
            ["Phase 6 - Refinement",
             "Added animations (Framer Motion), toast notifications, back-to-top "
             "button, 404 page, code review, and this report generator."],
        ],
        [35, 155],
    )

    # ════════════════════════════════════════════════════════════
    # 10. TESTING
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("10", "Testing")

    pdf.sub_title("10.1 Testing Strategy")
    pdf.body_text(
        "The project follows a component-level unit testing strategy for the customer frontend "
        "using Vitest as the test runner, @testing-library/react for rendering and interacting "
        "with components, @testing-library/jest-dom for extended DOM matchers, and JSDOM as "
        "the simulated browser environment. Tests focus on verifying that components render "
        "correctly and respond to user interactions as expected."
    )

    pdf.sub_title("10.2 Testing Frameworks and Tools")
    pdf.table(
        ["Tool", "Version", "Role"],
        [
            ["Vitest", "4.0 (frontend) / 0.34 (admin)", "Test runner and assertion library"],
            ["@testing-library/react", "16.3 (frontend) / 14.0 (admin)", "Component rendering and querying"],
            ["@testing-library/jest-dom", "Latest", "Custom DOM matchers (toBeInTheDocument, etc.)"],
            ["@testing-library/user-event", "Latest", "Simulated user interactions (click, type)"],
            ["JSDOM", "Built-in", "Headless browser environment for tests"],
            ["@babel/core + preset-react", "7.28", "JSX transformation for test environment"],
        ],
        [55, 50, 85],
    )

    pdf.sub_title("10.3 Frontend Test Coverage")
    pdf.table(
        ["Test File", "Component", "What Is Tested"],
        [
            ["App.test.jsx", "App", "Renders without crashing; routing setup"],
            ["Navbar.test.jsx", "Navbar", "Navigation links; cart badge visibility"],
            ["header.test.jsx", "Header", "Hero section renders with CTA button"],
            ["explore-menu.test.jsx", "ExploreMenu", "Category items render; selection callback"],
            ["FoodDisply.test.jsx", "FoodDisplay", "Food grid renders items from context"],
            ["FoodItem.test.jsx", "FoodItem", "Food card displays name/price; add-to-cart"],
            ["login.test.jsx", "Login", "Modal opens; form fields; submit trigger"],
            ["footer.test.jsx", "Footer", "Footer links and text render correctly"],
            ["AppDownload.test.jsx", "AppDownload", "Download section renders store badges"],
            ["verify.test.jsx", "Verify", "Payment verification page renders correctly"],
        ],
        [50, 32, 108],
    )

    pdf.sub_title("10.4 Running Tests")
    pdf.set_font("Courier", "", 9)
    test_commands = [
        "# Run all frontend tests",
        "cd frontend && npm test",
        "",
        "# Run tests with interactive UI",
        "cd frontend && npm run test:ui",
        "",
        "# Run all admin tests",
        "cd admin && npm test",
    ]
    for cmd in test_commands:
        pdf.cell(0, 5, cmd, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(*ReportPDF.DARK)
    pdf.sub_title("10.5 Admin Panel Testing Readiness")
    pdf.body_text(
        "The admin panel has Vitest and @testing-library/react installed and configured in its "
        "package.json scripts (test, test:ui). The modular OOP architecture (Repository, "
        "Strategy, Factory, domain models) is highly testable in isolation, making it "
        "straightforward to add comprehensive unit tests for each class."
    )

    # ════════════════════════════════════════════════════════════
    # 11. FUTURE IMPROVEMENTS
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("11", "Future Improvements")

    pdf.sub_title("11.1 Feature Enhancements")
    pdf.bullet("Real-time order tracking map - Integrate Google Maps or Mapbox to display "
               "a live delivery map on the My Orders page.")
    pdf.bullet("Push notifications - Use Web Push API or a service like Firebase Cloud Messaging "
               "to notify customers of order status changes without requiring email.")
    pdf.bullet("Restaurant / multi-vendor support - Allow multiple restaurants to register and "
               "manage their own menus, enabling a true marketplace model.")
    pdf.bullet("Food ratings and reviews - Allow customers to rate ordered items and leave "
               "text reviews visible to other users.")
    pdf.bullet("Discount codes and promotions - Implement a coupon system with percentage or "
               "fixed-amount discounts redeemable at checkout.")
    pdf.bullet("Scheduled orders - Allow customers to place orders in advance for a specified "
               "delivery time.")
    pdf.bullet("Loyalty points system - Award points per order that can be redeemed for discounts.")

    pdf.ln(3)
    pdf.sub_title("11.2 Technical Improvements")
    pdf.bullet("End-to-end testing - Add Playwright or Cypress tests to cover full user journeys "
               "(register, browse, order, verify payment) across the entire stack.")
    pdf.bullet("Backend unit and integration tests - Add Jest tests for all Service and "
               "Controller classes, and integration tests against a test MongoDB instance.")
    pdf.bullet("GraphQL API - Provide a GraphQL layer alongside the REST API for more "
               "flexible client-driven queries and reduced over-fetching.")
    pdf.bullet("WebSocket real-time updates - Use Socket.io so that the admin dashboard and "
               "My Orders page update order statuses without polling.")
    pdf.bullet("Containerisation - Add Docker Compose configuration to run MongoDB, backend, "
               "frontend, and admin panel as isolated containers for reproducible development "
               "and production environments.")
    pdf.bullet("CI/CD pipeline - Configure GitHub Actions to run linting, unit tests, and "
               "automated deployment on every push to the main branch.")
    pdf.bullet("TypeScript migration - Convert the codebase to TypeScript for compile-time "
               "type safety, better IDE support, and reduced runtime errors.")

    pdf.ln(3)
    pdf.sub_title("11.3 Security and Performance Improvements")
    pdf.bullet("HTTPS enforcement - Deploy backend behind an NGINX reverse proxy with "
               "Let's Encrypt TLS certificates.")
    pdf.bullet("Refresh token rotation - Replace long-lived JWTs with short-lived access "
               "tokens and refresh token rotation for better session security.")
    pdf.bullet("Input sanitisation - Add express-validator middleware to all routes for "
               "server-side input sanitisation and detailed validation error messages.")
    pdf.bullet("Image CDN - Serve food images via a CDN (Cloudinary or AWS S3 + CloudFront) "
               "instead of local disk storage for better performance and scalability.")
    pdf.bullet("Caching - Introduce Redis caching for frequently read data (food list, "
               "categories) to reduce database load.")
    pdf.bullet("Database pagination - Add cursor-based or offset pagination to all list "
               "endpoints to support large datasets efficiently.")
    pdf.bullet("Accessibility audit - Conduct WCAG 2.1 accessibility review and fix "
               "keyboard navigation and screen reader support throughout the React apps.")

    # ── Save ─────────────────────────────────────────────────────
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                               "Food_Delivery_Project_Report.pdf")
    pdf.output(output_path)
    print(f"Report generated: {output_path}")


if __name__ == "__main__":
    build_report()
