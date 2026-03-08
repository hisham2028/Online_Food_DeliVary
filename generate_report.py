"""
Food Delivery Project – Comprehensive PDF Report Generator
"""

from fpdf import FPDF
from datetime import datetime


class ReportPDF(FPDF):
    # ── colours ──────────────────────────────────────────────────
    ORANGE = (255, 100, 0)
    DARK = (30, 30, 30)
    GRAY = (100, 100, 100)
    LIGHT_BG = (250, 247, 243)
    WHITE = (255, 255, 255)
    ACCENT = (255, 140, 0)
    SECTION_BG = (255, 245, 235)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "B", 9)
        self.set_text_color(*self.GRAY)
        self.cell(0, 8, "Food Delivery Platform - Project Report", align="L")
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
        x = self.get_x()
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        self.set_x(x + indent)
        self.cell(5, 6, chr(8226))
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
    pdf.cell(0, 12, "Full-Stack Project Report", align="C", new_x="LMARGIN", new_y="NEXT")
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
    for l in lines:
        pdf.cell(0, 9, l, align="C", new_x="LMARGIN", new_y="NEXT")

    # ════════════════════════════════════════════════════════════
    # TABLE OF CONTENTS
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(*ReportPDF.ORANGE)
    pdf.cell(0, 12, "Table of Contents", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    toc = [
        ("1", "Project Overview"),
        ("2", "System Architecture"),
        ("3", "Technology Stack"),
        ("4", "Backend Architecture"),
        ("5", "Frontend Architecture (Customer App)"),
        ("6", "Admin Panel Architecture"),
        ("7", "Design Patterns Used"),
        ("8", "Database Schema"),
        ("9", "API Endpoints"),
        ("10", "Authentication & Security"),
        ("11", "Third-Party Integrations"),
        ("12", "Testing Strategy"),
        ("13", "Project File Structure"),
        ("14", "Key Features Summary"),
        ("15", "Deployment & Configuration"),
    ]
    for num, title in toc:
        pdf.set_font("Helvetica", "", 12)
        pdf.set_text_color(*ReportPDF.DARK)
        pdf.cell(12, 8, num + ".")
        pdf.cell(0, 8, title, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # ════════════════════════════════════════════════════════════
    # 1. PROJECT OVERVIEW
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("1", "Project Overview")
    pdf.body_text(
        "The Food Delivery Platform is a full-stack web application built using the MERN stack "
        "(MongoDB, Express.js, React.js, Node.js). The project follows Object-Oriented Programming "
        "(OOP) principles throughout its codebase, employing industry-standard design patterns such as "
        "Singleton, Repository, Strategy, Factory, Observer, Adapter, and Dependency Injection."
    )
    pdf.body_text(
        "The platform is composed of three independent sub-applications that share a common backend API:"
    )
    pdf.bullet("Customer Frontend - A React 19 SPA for browsing, ordering, and tracking food.")
    pdf.bullet("Admin Panel - A React 18 dashboard for managing food items, orders, and analytics.")
    pdf.bullet("Backend API - A Node.js / Express RESTful server with MongoDB persistence.")
    pdf.ln(2)
    pdf.body_text(
        "The system supports user registration and login (including social login via Firebase), "
        "a full shopping cart, Stripe-based checkout, real-time order status tracking, email "
        "notifications, and an admin dashboard with analytics and order-filtering capabilities."
    )

    # ════════════════════════════════════════════════════════════
    # 2. SYSTEM ARCHITECTURE
    # ════════════════════════════════════════════════════════════
    pdf.section_title("2", "System Architecture")
    pdf.body_text(
        "The system follows a three-tier architecture with clear separation of concerns:"
    )
    pdf.ln(2)
    pdf.sub_title("High-Level Architecture Diagram")
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

    pdf.body_text(
        "Presentation Tier: Two React SPAs (Customer & Admin) communicate with the backend "
        "exclusively via RESTful HTTP APIs. Each has its own Vite build pipeline."
    )
    pdf.body_text(
        "Application Tier: The Express.js server is structured using OOP classes — Server, "
        "Controllers, Services, Models, Middleware — following the Single Responsibility Principle."
    )
    pdf.body_text(
        "Data Tier: MongoDB (via Mongoose ODM) stores Users, Food Items, and Orders. "
        "Stripe handles payment processing. Firebase handles social authentication."
    )

    # ════════════════════════════════════════════════════════════
    # 3. TECHNOLOGY STACK
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("3", "Technology Stack")

    pdf.sub_title("Backend")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["Node.js", "v16+", "JavaScript runtime"],
            ["Express.js", "4.18", "HTTP server / routing"],
            ["MongoDB", "v5+", "NoSQL database"],
            ["Mongoose", "8.1", "ODM for MongoDB"],
            ["Stripe", "14.14", "Payment processing"],
            ["JSON Web Token", "9.0", "Authentication tokens"],
            ["bcryptjs", "2.4", "Password hashing"],
            ["Multer", "1.4", "File upload handling"],
            ["Nodemailer", "8.0", "Email notifications"],
            ["express-rate-limit", "7.5", "API rate limiting"],
            ["dotenv", "16.4", "Environment configuration"],
            ["Nodemon", "3.0", "Development hot-reload"],
        ],
        [55, 30, 105],
    )

    pdf.sub_title("Customer Frontend")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["React", "19.2", "UI library"],
            ["React Router DOM", "7.12", "Client-side routing"],
            ["Vite", "7.2", "Build tool / dev server"],
            ["Axios", "1.13", "HTTP client"],
            ["Firebase", "12.9", "Social authentication"],
            ["Framer Motion", "12.29", "Page transition animations"],
            ["React Toastify", "11.0", "Toast notifications"],
            ["Vitest", "4.0", "Unit testing framework"],
            ["Testing Library", "16.3", "Component testing utilities"],
        ],
        [55, 30, 105],
    )

    pdf.sub_title("Admin Panel")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["React", "18.2", "UI library"],
            ["React Router DOM", "6.18", "Client-side routing"],
            ["Vite", "4.5", "Build tool / dev server"],
            ["Axios", "1.6", "HTTP client"],
            ["React Toastify", "9.1", "Toast notifications"],
            ["Vitest", "0.34", "Unit testing framework"],
        ],
        [55, 30, 105],
    )

    # ════════════════════════════════════════════════════════════
    # 4. BACKEND ARCHITECTURE
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("4", "Backend Architecture")
    pdf.body_text(
        "The backend follows a layered OOP architecture. Every layer is implemented as ES6 classes "
        "and exported as singleton instances to guarantee a single shared state."
    )

    pdf.sub_title("4.1 Layers")
    pdf.bullet("Server (server.js) - Application entry point; initialises middleware, routes, and DB connection.")
    pdf.bullet("Routes - Thin routing layer that maps HTTP verbs to controller methods and attaches middleware.")
    pdf.bullet("Controllers - Receive requests, delegate to services, and return responses. No business logic.")
    pdf.bullet("Services - Contain all business logic (CartService, FoodService, OrderService, UserService, StripeService, EmailService).")
    pdf.bullet("Models - Mongoose schema definitions wrapped in OOP classes with CRUD helper methods.")
    pdf.bullet("Middleware - Cross-cutting concerns: AuthMiddleware (JWT verification), FileUploadMiddleware (Multer).")
    pdf.bullet("Config - Database singleton that manages the MongoDB connection.")

    pdf.ln(3)
    pdf.sub_title("4.2 Server Class")
    pdf.body_text(
        "The Server class in server.js is the composition root. It initialises Express, configures "
        "CORS, JSON parsing, and rate limiting (100 requests / 15 min), registers all route modules, "
        "serves static files from /uploads, and starts listening after a successful DB connection."
    )

    pdf.sub_title("4.3 Model Classes")
    pdf.body_text(
        "Each model (FoodModel, UserModel, OrderModel) encapsulates a Mongoose schema and exposes "
        "async CRUD methods (create, findById, findAll, updateById, deleteById) plus domain-specific "
        "helpers like UserModel.updateCart() and OrderModel.updateStatus(). Models are exported as "
        "singleton instances."
    )

    pdf.sub_title("4.4 Service Classes")
    pdf.table(
        ["Service", "Responsibility"],
        [
            ["UserService", "Registration, login, password hashing, JWT creation, profile management"],
            ["FoodService", "CRUD operations on food items, image handling, search"],
            ["CartService", "Add / remove / get / clear cart items for authenticated users"],
            ["OrderService", "Place orders, verify payments, track status, cancel orders"],
            ["StripeService", "Create Stripe checkout sessions and payment intents"],
            ["EmailService", "Send transactional emails via Nodemailer (order status updates)"],
        ],
        [40, 150],
    )

    # ════════════════════════════════════════════════════════════
    # 5. FRONTEND ARCHITECTURE
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("5", "Frontend Architecture (Customer App)")

    pdf.sub_title("5.1 Application Structure")
    pdf.body_text(
        "The customer-facing frontend is a React 19 single-page application built with Vite. "
        "It uses React Router v7 for navigation with AnimatePresence (Framer Motion) for smooth "
        "page transitions."
    )

    pdf.sub_title("5.2 Pages")
    pdf.table(
        ["Page", "Route", "Description"],
        [
            ["Home", "/", "Landing page with header, featured categories, food display"],
            ["Menu", "/menu", "Full menu browsing with category filtering"],
            ["Cart", "/cart", "Shopping cart with quantity management"],
            ["Place Order", "/order", "Checkout form with delivery address"],
            ["Verify", "/verify", "Stripe payment verification callback"],
            ["My Orders", "/myorders", "Order history and status tracking"],
            ["Not Found", "*", "404 error page"],
        ],
        [35, 30, 125],
    )

    pdf.sub_title("5.3 Key Components")
    pdf.table(
        ["Component", "Description"],
        [
            ["Navbar", "Navigation bar with cart badge and login trigger"],
            ["Header", "Hero section with call-to-action"],
            ["ExploreMenu", "Horizontal scrollable category selector"],
            ["FeaturedCategories", "Visual category cards with hover animations"],
            ["FoodDisplay", "Grid of food items filtered by category"],
            ["FoodItem", "Individual food card with add-to-cart"],
            ["Login", "Modal with email/password + social login (Google/Facebook)"],
            ["Footer", "Site footer with links and social icons"],
            ["BackToTop", "Scroll-to-top floating button"],
            ["ScrollToTop", "Auto-scroll on route change"],
            ["OrderConfirmation", "Post-checkout confirmation display"],
            ["SpecialSections", "Promotional content sections"],
            ["OurServices", "Service highlights section"],
            ["AppDownload", "Mobile app download CTA"],
        ],
        [50, 140],
    )

    pdf.sub_title("5.4 State Management - StoreContext")
    pdf.body_text(
        "Global state is managed via React Context (StoreContext). It holds the food list, "
        "cart items, authentication token, and loading state. It exposes helper functions: "
        "addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems. The cart is synced "
        "with the backend for logged-in users via Axios API calls."
    )

    pdf.sub_title("5.5 Authentication Service")
    pdf.body_text(
        "The AuthService class integrates Firebase Authentication for social login (Google and "
        "Facebook). After Firebase authentication, it sends the user profile to the backend's "
        "/api/user/social-login endpoint to create or retrieve a JWT token."
    )

    pdf.sub_title("5.6 Adapter Pattern - RepositoryAdapter")
    pdf.body_text(
        "The frontend includes a RepositoryAdapter module that defines an IRepository interface "
        "and adapters (MongooseAdapter, SQLAdapter) via a RepositoryFactory. This enables swapping "
        "the data layer without modifying consuming components."
    )

    # ════════════════════════════════════════════════════════════
    # 6. ADMIN PANEL
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("6", "Admin Panel Architecture")
    pdf.body_text(
        "The admin panel is a React 18 SPA that follows a rich OOP architecture with multiple "
        "design patterns. It uses a ServiceContext for dependency injection and domain models for "
        "all data transformations."
    )

    pdf.sub_title("6.1 Pages")
    pdf.table(
        ["Page", "Route", "Description"],
        [
            ["Dashboard", "/ , /dashboard", "Analytics: total orders, revenue, status breakdown"],
            ["Add", "/add", "Add new food item with image upload"],
            ["List", "/list", "View and manage all food items"],
            ["Orders", "/orders", "View and update order statuses"],
        ],
        [35, 40, 115],
    )

    pdf.sub_title("6.2 Service Layer")
    pdf.body_text(
        "ApiService (Singleton): A single Axios instance for the entire app. Handles base URL, "
        "timeout (10s), auth token injection via request interceptor, and error normalisation via "
        "response interceptor. Exposes get(), post(), and postForm() methods."
    )

    pdf.sub_title("6.3 Repository Layer")
    pdf.body_text(
        "FoodRepository and OrderRepository abstract all HTTP calls behind clean async methods "
        "(getAll, add, remove, updateStatus). Components never interact with raw HTTP — they "
        "depend only on repository abstractions."
    )

    pdf.sub_title("6.4 Domain Models")
    pdf.body_text(
        "Rich domain models transform raw API data into typed objects with computed properties:"
    )
    pdf.bullet("Order - shortId, formattedAmount, formattedDate, itemSummary, statusClass, isWithin(period)")
    pdf.bullet("OrderItem - name, quantity, toString()")
    pdf.bullet("Address - fullName, cityLine, singleLine")
    pdf.bullet("FoodItem - formattedPrice")
    pdf.bullet("DashboardStats - totalOrders, totalRevenue, formattedRevenue, status breakdowns")

    pdf.sub_title("6.5 EventBus (Observer Pattern)")
    pdf.body_text(
        "A singleton EventBus enables decoupled communication between components. Named event "
        "constants (FOOD_ADDED, FOOD_REMOVED, ORDER_STATUS_CHANGED, SIDEBAR_TOGGLE) prevent "
        "magic strings. Components subscribe with on() and publish with emit()."
    )

    # ════════════════════════════════════════════════════════════
    # 7. DESIGN PATTERNS
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("7", "Design Patterns Used")

    patterns = [
        ("Singleton", "Backend",
         "All Models, Services, and the Database config are exported as singleton instances "
         "(e.g., `export default new FoodModel()`). Ensures one shared instance across the app."),
        ("Singleton", "Admin",
         "ApiService uses a private static #instance field with getInstance() to guarantee a "
         "single Axios client. EventBus also follows the Singleton pattern."),
        ("Repository", "Admin",
         "FoodRepository and OrderRepository encapsulate all API calls. Components depend on "
         "these abstractions, never on raw HTTP, enabling easy backend swaps."),
        ("Strategy", "Admin",
         "OrderFilterStrategy implements interchangeable time-period filters (AllTime, Today, "
         "Week, Month, Year). Adding a new filter requires zero changes to existing code (Open/Closed Principle)."),
        ("Factory", "Admin",
         "FoodFormFactory centralises creation and immutable updates of FoodFormData objects. "
         "Provides createEmpty(), create(overrides), and withField() static methods."),
        ("Observer", "Admin",
         "EventBus (publish/subscribe) decouples components. When food is added, an event is "
         "emitted and any listening component reacts without direct coupling."),
        ("Adapter", "Frontend",
         "RepositoryAdapter defines an IRepository interface with MongooseAdapter and SQLAdapter "
         "implementations, created via a RepositoryFactory."),
        ("Dependency Injection", "Admin",
         "Services are instantiated once in App.jsx and injected into the component tree via "
         "React Context (ServiceContext). Components call useServices() to access them."),
        ("MVC / Layered", "Backend",
         "Routes -> Controllers -> Services -> Models. Each layer has a single responsibility. "
         "Controllers never contain business logic; Services never handle HTTP."),
        ("Context Pattern", "Frontend",
         "StoreContext provides global state (food list, cart, auth token) to all components "
         "without prop drilling, using React's createContext and useContext."),
    ]

    pdf.table(
        ["Pattern", "Layer", "Implementation Details"],
        patterns,
        [30, 20, 140],
    )

    # ════════════════════════════════════════════════════════════
    # 8. DATABASE SCHEMA
    # ════════════════════════════════════════════════════════════
    pdf.section_title("8", "Database Schema")
    pdf.sub_title("8.1 User Collection")
    pdf.table(
        ["Field", "Type", "Constraints"],
        [
            ["name", "String", "Required"],
            ["email", "String", "Required, Unique"],
            ["password", "String", "Required"],
            ["cartData", "Object", "Default: {}"],
            ["resetPasswordToken", "String", "Optional"],
            ["resetPasswordExpire", "Date", "Optional"],
            ["createdAt / updatedAt", "Date", "Auto (timestamps)"],
        ],
        [55, 40, 95],
    )

    pdf.sub_title("8.2 Food Collection")
    pdf.table(
        ["Field", "Type", "Constraints"],
        [
            ["name", "String", "Required, text-indexed"],
            ["description", "String", "Required, text-indexed"],
            ["price", "Number", "Required, min: 0"],
            ["image", "String", "Required"],
            ["category", "String", "Required, text-indexed"],
            ["isAvailable", "Boolean", "Default: true"],
            ["createdAt / updatedAt", "Date", "Auto (timestamps)"],
        ],
        [55, 40, 95],
    )

    pdf.sub_title("8.3 Order Collection")
    pdf.table(
        ["Field", "Type", "Constraints"],
        [
            ["userId", "String", "Required"],
            ["items", "Array", "Required"],
            ["amount", "Number", "Required"],
            ["address", "Object", "Required"],
            ["status", "String", "Default: 'Food Processing'"],
            ["date", "Date", "Default: Date.now"],
            ["payment", "Boolean", "Default: false"],
        ],
        [55, 40, 95],
    )

    # ════════════════════════════════════════════════════════════
    # 9. API ENDPOINTS
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("9", "API Endpoints")

    pdf.sub_title("9.1 User Routes  /api/user")
    pdf.table(
        ["Method", "Endpoint", "Auth", "Description"],
        [
            ["POST", "/register", "No", "Register a new user"],
            ["POST", "/login", "No", "Login and receive JWT"],
            ["GET", "/profile", "Yes", "Get authenticated user profile"],
            ["POST", "/social-login", "No", "Firebase social login (Google/Facebook)"],
        ],
        [20, 45, 15, 110],
    )

    pdf.sub_title("9.2 Food Routes  /api/food")
    pdf.table(
        ["Method", "Endpoint", "Auth", "Description"],
        [
            ["POST", "/add", "No", "Add food item (multipart form with image)"],
            ["GET", "/list", "No", "Get all food items"],
            ["POST", "/remove", "No", "Remove a food item by ID"],
            ["PUT", "/update/:id", "No", "Update a food item"],
            ["GET", "/search", "No", "Full-text search on food items"],
        ],
        [20, 45, 15, 110],
    )

    pdf.sub_title("9.3 Cart Routes  /api/cart")
    pdf.table(
        ["Method", "Endpoint", "Auth", "Description"],
        [
            ["POST", "/add", "Yes", "Add item to cart"],
            ["POST", "/remove", "Yes", "Remove item from cart"],
            ["POST", "/get", "Yes", "Get current user's cart"],
            ["POST", "/clear", "Yes", "Clear entire cart"],
        ],
        [20, 45, 15, 110],
    )

    pdf.sub_title("9.4 Order Routes  /api/order")
    pdf.table(
        ["Method", "Endpoint", "Auth", "Description"],
        [
            ["POST", "/place", "Yes", "Place a new order (creates Stripe session)"],
            ["POST", "/verify", "No", "Verify Stripe payment callback"],
            ["POST", "/userorders", "Yes", "Get orders for authenticated user"],
            ["GET", "/list", "No", "Get all orders (admin)"],
            ["POST", "/status", "No", "Update order status (admin)"],
            ["GET", "/:id", "No", "Get a single order by ID"],
            ["POST", "/cancel", "Yes", "Cancel an order"],
        ],
        [20, 45, 15, 110],
    )

    # ════════════════════════════════════════════════════════════
    # 10. AUTHENTICATION & SECURITY
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("10", "Authentication & Security")

    pdf.sub_title("10.1 JWT Authentication")
    pdf.body_text(
        "User authentication is handled via JSON Web Tokens. On login or registration, the "
        "server issues a JWT (expires in 7 days) signed with a secret from environment variables. "
        "Protected routes use AuthMiddleware to verify the token sent in the 'token' header."
    )

    pdf.sub_title("10.2 Password Security")
    pdf.body_text(
        "Passwords are hashed using bcryptjs before storage. Minimum password length is 6 characters. "
        "Input validation is performed using the validator library."
    )

    pdf.sub_title("10.3 Social Authentication (Firebase)")
    pdf.body_text(
        "The frontend integrates Firebase Authentication for Google and Facebook sign-in via popup. "
        "After Firebase authenticates the user, the frontend sends the profile to the backend's "
        "/api/user/social-login endpoint, which creates or finds the user and returns a JWT."
    )

    pdf.sub_title("10.4 Rate Limiting")
    pdf.body_text(
        "The API is protected by express-rate-limit: maximum 100 requests per 15-minute window "
        "per IP address. Standard rate-limit headers are included in responses."
    )

    pdf.sub_title("10.5 CORS")
    pdf.body_text(
        "Cross-Origin Resource Sharing is enabled globally via the cors middleware, "
        "allowing the frontend and admin panel to communicate with the backend from different origins."
    )

    # ════════════════════════════════════════════════════════════
    # 11. THIRD-PARTY INTEGRATIONS
    # ════════════════════════════════════════════════════════════
    pdf.section_title("11", "Third-Party Integrations")

    pdf.sub_title("11.1 Stripe Payments")
    pdf.body_text(
        "The StripeService class handles payment processing. When a user places an order, "
        "it creates a Stripe Checkout Session with line items (food items + $2 delivery fee). "
        "After payment, Stripe redirects to /verify with success status and order ID. "
        "The backend then updates the order's payment status."
    )

    pdf.sub_title("11.2 Firebase Authentication")
    pdf.body_text(
        "Firebase provides Google and Facebook sign-in via signInWithPopup(). The AuthService "
        "class on the frontend manages the entire flow and syncs with the backend."
    )

    pdf.sub_title("11.3 Nodemailer Email Service")
    pdf.body_text(
        "The EmailService class sends transactional emails via SMTP (configurable host, default "
        "Gmail). It currently supports order status update notifications with HTML templates."
    )

    # ════════════════════════════════════════════════════════════
    # 12. TESTING STRATEGY
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("12", "Testing Strategy")

    pdf.sub_title("12.1 Testing Framework")
    pdf.body_text(
        "The project uses Vitest as the test runner with @testing-library/react for component "
        "testing and @testing-library/jest-dom for DOM assertions. JSDOM provides the browser "
        "environment. Tests can be run via `npm test` or with a UI via `npm run test:ui`."
    )

    pdf.sub_title("12.2 Frontend Test Coverage")
    pdf.table(
        ["Test File", "Component Tested"],
        [
            ["App.test.jsx", "App - routing and layout"],
            ["Navbar.test.jsx", "Navbar component"],
            ["header.test.jsx", "Header / hero section"],
            ["explore-menu.test.jsx", "Explore menu component"],
            ["FoodDisply.test.jsx", "Food display grid"],
            ["FoodItem.test.jsx", "Individual food item card"],
            ["login.test.jsx", "Login modal"],
            ["footer.test.jsx", "Footer component"],
            ["AppDownload.test.jsx", "App download section"],
            ["verify.test.jsx", "Payment verification page"],
        ],
        [65, 125],
    )

    pdf.sub_title("12.3 Admin Panel")
    pdf.body_text(
        "The admin panel has Vitest and Testing Library configured in its devDependencies "
        "and package.json scripts (test, test:ui), ready for test implementation."
    )

    # ════════════════════════════════════════════════════════════
    # 13. PROJECT FILE STRUCTURE
    # ════════════════════════════════════════════════════════════
    pdf.section_title("13", "Project File Structure")
    pdf.set_font("Courier", "", 8)
    structure = """Food-Del_upadated/
|-- package.json                  (Root config)
|-- backend/
|   |-- package.json
|   |-- README.md
|   |-- src/
|   |   |-- server.js             (Server class - entry point)
|   |   |-- config/
|   |   |   +-- Database.js       (Singleton DB connection)
|   |   |-- controllers/
|   |   |   |-- CartController.js
|   |   |   |-- FoodController.js
|   |   |   |-- OrderController.js
|   |   |   +-- UserController.js
|   |   |-- middleware/
|   |   |   |-- AuthMiddleware.js  (JWT verification)
|   |   |   +-- FileUploadMiddleware.js (Multer)
|   |   |-- models/
|   |   |   |-- FoodModel.js
|   |   |   |-- OrderModel.js
|   |   |   +-- UserModel.js
|   |   |-- routes/
|   |   |   |-- CartRoute.js
|   |   |   |-- FoodRoute.js
|   |   |   |-- OrderRoute.js
|   |   |   +-- UserRoute.js
|   |   +-- services/
|   |       |-- CartService.js
|   |       |-- EmailService.js
|   |       |-- FoodService.js
|   |       |-- OrderService.js
|   |       |-- StripeService.js
|   |       +-- UserService.js
|   +-- uploads/                  (Food images)
|-- frontend/
|   |-- package.json
|   |-- vite.config.mjs
|   |-- adapters/
|   |   +-- RepositoryAdapter.js  (Adapter pattern)
|   |-- src/
|   |   |-- App.jsx               (Router + AnimatePresence)
|   |   |-- context/
|   |   |   +-- StoreContext.jsx   (Global state)
|   |   |-- services/
|   |   |   +-- authService.js    (Firebase auth)
|   |   |-- firebase/
|   |   |-- components/           (14 components)
|   |   +-- pages/                (7 pages)
+-- admin/
    |-- package.json
    |-- vite.config.js
    +-- src/
        |-- App.jsx               (Composition root + DI)
        |-- services/
        |   +-- ApiService.js     (Singleton HTTP client)
        |-- repositories/
        |   |-- FoodRepository.js
        |   +-- OrderRepository.js
        |-- models/
        |   +-- index.js          (Order, FoodItem, DashboardStats, etc.)
        |-- strategies/
        |   +-- OrderFilterStrategy.js (Strategy pattern)
        |-- factories/
        |   +-- FoodFormFactory.js (Factory pattern)
        |-- events/
        |   +-- EventBus.js       (Observer pattern)
        |-- components/
        +-- pages/"""
    for line in structure.split("\n"):
        pdf.cell(0, 4, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # ════════════════════════════════════════════════════════════
    # 14. KEY FEATURES SUMMARY
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("14", "Key Features Summary")

    pdf.sub_title("Customer Features")
    pdf.bullet("Browse food items by category with animated transitions")
    pdf.bullet("Full-text search on food name, description, and category")
    pdf.bullet("Shopping cart with real-time quantity management (synced with backend)")
    pdf.bullet("Secure checkout via Stripe payment gateway ($2 delivery fee)")
    pdf.bullet("Order history with real-time status tracking")
    pdf.bullet("User registration / login with JWT authentication")
    pdf.bullet("Social login via Google and Facebook (Firebase)")
    pdf.bullet("Responsive design with smooth Framer Motion page transitions")
    pdf.bullet("Back-to-top button and automatic scroll-to-top on navigation")
    pdf.bullet("Toast notifications for all user actions")

    pdf.ln(3)
    pdf.sub_title("Admin Features")
    pdf.bullet("Dashboard with analytics: total orders, revenue, status breakdown")
    pdf.bullet("Order filtering by time period (Today, Week, Month, Year, All Time)")
    pdf.bullet("Add new food items with image upload")
    pdf.bullet("View and remove food items")
    pdf.bullet("Update order statuses (Food Processing / Out for Delivery / Delivered)")
    pdf.bullet("Email notifications sent to customers on status change")

    pdf.ln(3)
    pdf.sub_title("Technical Features")
    pdf.bullet("Full OOP architecture with ES6 classes throughout all layers")
    pdf.bullet("10+ design patterns: Singleton, Repository, Strategy, Factory, Observer, Adapter, DI, MVC, Context")
    pdf.bullet("API rate limiting (100 req / 15 min)")
    pdf.bullet("JWT-based authentication with 7-day expiry")
    pdf.bullet("Password hashing with bcryptjs")
    pdf.bullet("Mongoose ODM with schema validation and text indexing")
    pdf.bullet("Multer file upload middleware for food images")
    pdf.bullet("Environment-based configuration via dotenv")
    pdf.bullet("10 frontend unit tests with Vitest + Testing Library")
    pdf.bullet("Modular codebase with clear separation of concerns")

    # ════════════════════════════════════════════════════════════
    # 15. DEPLOYMENT & CONFIGURATION
    # ════════════════════════════════════════════════════════════
    pdf.section_title("15", "Deployment & Configuration")

    pdf.sub_title("15.1 Environment Variables")
    pdf.table(
        ["Variable", "Description", "Example"],
        [
            ["MONGODB_URI", "MongoDB connection string", "mongodb://localhost:27017/food-delivery"],
            ["JWT_SECRET", "Secret key for JWT signing", "(random secure string)"],
            ["STRIPE_SECRET_KEY", "Stripe API secret key", "sk_test_..."],
            ["PORT", "Backend server port", "4000"],
            ["FRONTEND_URL", "Frontend URL for Stripe redirects", "http://localhost:5173"],
            ["VITE_API_URL", "Backend URL for frontends", "http://localhost:4000"],
            ["EMAIL_USER", "SMTP email address", "your@gmail.com"],
            ["EMAIL_PASSWORD", "SMTP email password / app password", "(app password)"],
            ["SMTP_HOST", "SMTP server host", "smtp.gmail.com"],
            ["SMTP_PORT", "SMTP server port", "587"],
        ],
        [45, 70, 75],
    )

    pdf.sub_title("15.2 Running the Project")
    pdf.set_font("Courier", "", 9)
    commands = [
        "# Backend",
        "cd backend && npm install && npm run dev",
        "",
        "# Customer Frontend",
        "cd frontend && npm install && npm run dev",
        "",
        "# Admin Panel",
        "cd admin && npm install && npm run dev",
    ]
    for cmd in commands:
        pdf.cell(0, 5, cmd, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    pdf.set_font("Helvetica", "", 10)
    pdf.body_text(
        "The backend runs on port 4000 by default. The frontend and admin panel use Vite's "
        "dev server (typically ports 5173 and 5174). In production, the React apps are built "
        "with `npm run build` and served as static files."
    )

    # ── Save ────────────────────────────────────────────────────
    output_path = r"c:\Users\zisam\Desktop\Hisham\Food-Del_upadated\Food_Delivery_Project_Report.pdf"
    pdf.output(output_path)
    print(f"Report generated: {output_path}")


if __name__ == "__main__":
    build_report()
