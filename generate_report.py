"""
Food Delivery Project – Comprehensive PDF Report Generator (Major Revision)
Chapters: Introduction, User Stories, Use Cases, Use Case & User Story Mapping,
Acceptance Criteria, Diagrams, Database Design, Class Design, Implementation,
Backend Implementation, Design Patterns, UI/GUI Design, Technology Stack,
Testing Strategy, Feasibility, Deployment & Configuration.
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
        self.set_x(self.l_margin)
        self.multi_cell(190, 6, text)
        self.ln(2)

    def bullet(self, text, indent=15):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        cur_x = self.l_margin
        self.set_x(cur_x + indent)
        self.cell(6, 6, "-")
        self.multi_cell(self.w - self.r_margin - cur_x - indent - 6, 6, text)

    def numbered_bullet(self, number, text, indent=15):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(*self.DARK)
        cur_x = self.l_margin
        self.set_x(cur_x + indent)
        self.cell(9, 6, f"{number}.")
        self.multi_cell(self.w - self.r_margin - cur_x - indent - 9, 6, text)

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

    def multi_cell_table(self, headers, rows, col_widths=None, row_height=7):
        """Table that supports multi-line cells using multi_cell for the last column."""
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
            if self.get_y() > 255:
                self.add_page()
            if fill:
                self.set_fill_color(*self.LIGHT_BG)
            else:
                self.set_fill_color(*self.WHITE)
            # render all cells except last on same line
            start_x = self.get_x()
            start_y = self.get_y()
            for i, cell_text in enumerate(row[:-1]):
                self.set_xy(start_x + sum(col_widths[:i]), start_y)
                self.cell(col_widths[i], row_height, str(cell_text), border=1,
                          fill=True, align="C")
            # last cell as multi_cell
            last_x = start_x + sum(col_widths[:-1])
            self.set_xy(last_x, start_y)
            self.multi_cell(col_widths[-1], row_height, str(row[-1]),
                            border=1, fill=True, align="L")
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
    pdf.cell(0, 12, "Full-Stack Project Report  (Major Revision)", align="C",
             new_x="LMARGIN", new_y="NEXT")
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
        "Version:           2.0.0  (Major Revision)",
    ]
    for ln_text in lines:
        pdf.cell(0, 9, ln_text, align="C", new_x="LMARGIN", new_y="NEXT")

    # ════════════════════════════════════════════════════════════
    # TABLE OF CONTENTS
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(*ReportPDF.ORANGE)
    pdf.cell(0, 12, "Table of Contents", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    toc = [
        ("1",  "Introduction"),
        ("2",  "User Stories"),
        ("3",  "Use Cases"),
        ("4",  "Use Case and User Story Mapping"),
        ("5",  "Acceptance Criteria"),
        ("6",  "Diagrams"),
        ("7",  "Database Design"),
        ("8",  "Class Design"),
        ("9",  "Implementation Overview"),
        ("10", "Backend Implementation"),
        ("11", "Design Patterns Implemented"),
        ("12", "UI / GUI Design"),
        ("13", "Technology Stack"),
        ("14", "Testing Strategy"),
        ("15", "Feasibility Analysis"),
        ("16", "Deployment & Configuration"),
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

    pdf.sub_title("1.1 Project Background")
    pdf.body_text(
        "The Food Delivery Platform is a full-stack web application developed to solve the "
        "growing demand for convenient, reliable online food ordering services. The system "
        "enables customers to browse restaurant menus, place orders, make secure online "
        "payments, and track their orders in real time, all from a single web interface."
    )

    pdf.sub_title("1.2 Purpose and Scope")
    pdf.body_text(
        "The purpose of this project is to demonstrate the application of modern software "
        "engineering principles including Object-Oriented Programming (OOP), design patterns, "
        "RESTful API design, and component-based UI development in building a production-ready "
        "food delivery system."
    )
    pdf.body_text(
        "The scope of the system covers three sub-applications that share a single backend API:"
    )
    pdf.bullet("Customer Frontend  -  A React 19 single-page application for customers "
               "to browse food, manage their cart, checkout, and track orders.")
    pdf.bullet("Admin Panel  -  A React 18 dashboard for administrators to manage food items, "
               "review orders, update order statuses, and view analytics.")
    pdf.bullet("Backend API  -  A Node.js / Express RESTful server connected to a MongoDB "
               "database, handling all business logic, authentication, and payment processing.")

    pdf.sub_title("1.3 System Overview")
    pdf.body_text(
        "The platform is built on the MERN stack (MongoDB, Express.js, React.js, Node.js) and "
        "follows OOP principles throughout every layer. It integrates Stripe for payment "
        "processing, Firebase for social authentication (Google and Facebook), and Nodemailer "
        "for transactional email notifications. The entire codebase uses ES6+ class syntax with "
        "multiple industry-standard design patterns."
    )

    pdf.sub_title("1.4 Key Objectives")
    pdf.numbered_bullet("1", "Provide a seamless and intuitive food ordering experience for customers.")
    pdf.numbered_bullet("2", "Offer an efficient admin interface for managing food catalogue and orders.")
    pdf.numbered_bullet("3", "Implement secure user authentication with both traditional and social login.")
    pdf.numbered_bullet("4", "Integrate a reliable payment gateway to handle financial transactions safely.")
    pdf.numbered_bullet("5", "Apply design patterns and OOP principles to produce maintainable code.")
    pdf.numbered_bullet("6", "Ensure scalability through a clean, layered architecture.")

    pdf.sub_title("1.5 Stakeholders")
    pdf.table(
        ["Stakeholder", "Role", "Interest"],
        [
            ["Customer", "End User", "Browse menu, place & track orders, receive email updates"],
            ["Administrator", "System Operator", "Manage food items, view and update orders, analytics"],
            ["Developer", "Technical Team", "Build, maintain, and extend the platform"],
            ["Payment Provider (Stripe)", "Third Party", "Secure card payment processing"],
            ["Auth Provider (Firebase)", "Third Party", "Social login identity management"],
        ],
        [45, 40, 105],
    )

    # ════════════════════════════════════════════════════════════
    # 2. USER STORIES
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("2", "User Stories")
    pdf.body_text(
        "User stories describe the desired functionality from the perspective of each stakeholder. "
        "They follow the standard format: As a <role>, I want to <goal> so that <benefit>."
    )

    pdf.sub_title("2.1 Customer User Stories")
    pdf.table(
        ["ID", "Story", "Priority"],
        [
            ["US-01", "As a customer, I want to browse the full food menu so that I can discover available dishes.", "High"],
            ["US-02", "As a customer, I want to filter food by category so that I can find specific types of cuisine quickly.", "High"],
            ["US-03", "As a customer, I want to search for a food item by name so that I can locate a specific dish fast.", "Medium"],
            ["US-04", "As a customer, I want to add items to a shopping cart so that I can review my selection before ordering.", "High"],
            ["US-05", "As a customer, I want to update item quantities in my cart so that I can control how much I order.", "High"],
            ["US-06", "As a customer, I want to register with an email and password so that I can create a personal account.", "High"],
            ["US-07", "As a customer, I want to log in using Google or Facebook so that I can access the app without a password.", "Medium"],
            ["US-08", "As a customer, I want to enter a delivery address at checkout so that my order is sent to the right place.", "High"],
            ["US-09", "As a customer, I want to pay securely online via card so that I can complete my purchase safely.", "High"],
            ["US-10", "As a customer, I want to view my past orders so that I can track previous purchases and reorder.", "Medium"],
            ["US-11", "As a customer, I want to receive an email when my order status changes so that I stay informed.", "Medium"],
            ["US-12", "As a customer, I want to cancel a pending order so that I am not charged for an unwanted purchase.", "Low"],
        ],
        [18, 140, 22],
    )

    pdf.sub_title("2.2 Administrator User Stories")
    pdf.table(
        ["ID", "Story", "Priority"],
        [
            ["US-13", "As an admin, I want to add new food items with images so that the menu stays up to date.", "High"],
            ["US-14", "As an admin, I want to remove food items from the menu so that unavailable dishes are hidden.", "High"],
            ["US-15", "As an admin, I want to view all customer orders so that I can manage fulfilment.", "High"],
            ["US-16", "As an admin, I want to update an order's status so that customers are kept informed of their delivery.", "High"],
            ["US-17", "As an admin, I want to view a dashboard with total orders and revenue so that I can monitor performance.", "Medium"],
            ["US-18", "As an admin, I want to filter orders by time period (today, week, month) so that I can analyse trends.", "Medium"],
            ["US-19", "As an admin, I want to edit food item details and availability so that prices and descriptions stay accurate.", "Medium"],
        ],
        [18, 140, 22],
    )

    # ════════════════════════════════════════════════════════════
    # 3. USE CASES
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("3", "Use Cases")
    pdf.body_text(
        "Use cases describe the interactions between actors and the system to achieve specific goals. "
        "The primary actors are Customer and Administrator. The system actor is the Backend API."
    )

    pdf.sub_title("3.1 Actors")
    pdf.table(
        ["Actor", "Type", "Description"],
        [
            ["Customer", "Primary", "Registered or guest user who browses and orders food"],
            ["Administrator", "Primary", "Staff member who manages the food catalogue and orders"],
            ["Backend API", "System", "Processes requests, enforces business rules, persists data"],
            ["Stripe", "External", "Handles card payment authorisation and capture"],
            ["Firebase", "External", "Provides social identity (Google / Facebook) verification"],
        ],
        [35, 25, 130],
    )

    pdf.sub_title("3.2 Use Case: Browse and Search Menu (UC-01)")
    pdf.table(
        ["Field", "Detail"],
        [
            ["Use Case ID", "UC-01"],
            ["Name", "Browse and Search Menu"],
            ["Primary Actor", "Customer"],
            ["Preconditions", "Application is running; food catalogue is populated"],
            ["Main Flow", "1. Customer opens the home page  2. System loads all food items  3. Customer selects a category filter  4. System displays filtered items  5. Customer types in search box  6. System returns matching items"],
            ["Alternate Flow", "3a. Customer skips category filter; all items remain visible"],
            ["Postconditions", "Customer views the desired food items"],
        ],
        [45, 145],
    )

    pdf.sub_title("3.3 Use Case: Place Order (UC-02)")
    pdf.table(
        ["Field", "Detail"],
        [
            ["Use Case ID", "UC-02"],
            ["Name", "Place Order"],
            ["Primary Actor", "Customer"],
            ["Preconditions", "Customer is authenticated; cart has at least one item"],
            ["Main Flow", "1. Customer reviews cart  2. Customer clicks Proceed to Checkout  3. Customer enters delivery address  4. Customer clicks Place Order  5. System creates order and Stripe session  6. Customer is redirected to Stripe  7. Customer completes card payment  8. Stripe redirects to /verify  9. System marks order as paid"],
            ["Alternate Flow", "7a. Customer cancels payment; order is deleted"],
            ["Postconditions", "Order stored with payment=true; cart is cleared; confirmation email sent"],
        ],
        [45, 145],
    )

    pdf.sub_title("3.4 Use Case: Manage Food Items (UC-03)")
    pdf.table(
        ["Field", "Detail"],
        [
            ["Use Case ID", "UC-03"],
            ["Name", "Manage Food Items"],
            ["Primary Actor", "Administrator"],
            ["Preconditions", "Admin is on the Add or List page"],
            ["Main Flow", "1. Admin fills the Add Food form (name, description, price, category, image)  2. Admin submits the form  3. System validates input and uploads image  4. System saves food item to database  5. Admin views the List page  6. Admin deletes an item; system removes it from the database"],
            ["Alternate Flow", "2a. Validation fails; system shows error toast; item not saved"],
            ["Postconditions", "Food catalogue reflects the added or removed items"],
        ],
        [45, 145],
    )

    pdf.sub_title("3.5 Use Case: Update Order Status (UC-04)")
    pdf.table(
        ["Field", "Detail"],
        [
            ["Use Case ID", "UC-04"],
            ["Name", "Update Order Status"],
            ["Primary Actor", "Administrator"],
            ["Preconditions", "Admin is on the Orders page; at least one order exists"],
            ["Main Flow", "1. Admin views list of orders  2. Admin selects new status from drop-down  3. System updates order status in database  4. System sends email notification to customer"],
            ["Alternate Flow", "3a. Database update fails; system shows error; status unchanged"],
            ["Postconditions", "Order reflects new status; customer receives notification email"],
        ],
        [45, 145],
    )

    pdf.sub_title("3.6 Use Case: User Registration and Login (UC-05)")
    pdf.table(
        ["Field", "Detail"],
        [
            ["Use Case ID", "UC-05"],
            ["Name", "User Registration and Login"],
            ["Primary Actor", "Customer"],
            ["Preconditions", "Application is accessible"],
            ["Main Flow (Register)", "1. Customer clicks Login  2. Switches to Sign Up  3. Enters name, email, and password  4. System validates and hashes password  5. System creates user record and returns JWT  6. Customer is logged in"],
            ["Main Flow (Login)", "1. Customer enters email and password  2. System verifies credentials  3. System issues JWT  4. Customer session is started"],
            ["Alt. Flow (Social)", "1. Customer clicks Google or Facebook  2. Firebase popup authenticates user  3. System calls /api/user/social-login  4. System creates or retrieves user; returns JWT"],
            ["Postconditions", "Customer holds a valid JWT stored in browser; cart is synced"],
        ],
        [45, 145],
    )

    # ════════════════════════════════════════════════════════════
    # 4. USE CASE AND USER STORY MAPPING
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("4", "Use Case and User Story Mapping")
    pdf.body_text(
        "The following table maps each user story to its corresponding use case(s), showing how "
        "the high-level scenarios decompose into specific functional requirements."
    )

    pdf.table(
        ["User Story ID", "User Story (Summary)", "Use Case(s)"],
        [
            ["US-01", "Browse full menu",                    "UC-01"],
            ["US-02", "Filter food by category",             "UC-01"],
            ["US-03", "Search for food by name",             "UC-01"],
            ["US-04", "Add items to cart",                   "UC-02"],
            ["US-05", "Update item quantities in cart",      "UC-02"],
            ["US-06", "Register with email & password",      "UC-05"],
            ["US-07", "Social login (Google / Facebook)",    "UC-05"],
            ["US-08", "Enter delivery address at checkout",  "UC-02"],
            ["US-09", "Pay securely via card",               "UC-02"],
            ["US-10", "View past orders",                    "UC-02"],
            ["US-11", "Receive email on status change",      "UC-04"],
            ["US-12", "Cancel pending order",                "UC-02"],
            ["US-13", "Add food items (admin)",              "UC-03"],
            ["US-14", "Remove food items (admin)",           "UC-03"],
            ["US-15", "View all customer orders (admin)",    "UC-04"],
            ["US-16", "Update order status (admin)",         "UC-04"],
            ["US-17", "View analytics dashboard (admin)",    "UC-04"],
            ["US-18", "Filter orders by time period (admin)","UC-04"],
            ["US-19", "Edit food item details (admin)",      "UC-03"],
        ],
        [30, 100, 60],
    )

    pdf.body_text(
        "This mapping ensures full traceability from user requirements (stories) to system "
        "behaviour (use cases) and ultimately to code implementation. Each use case groups "
        "related user stories that share the same actors and system boundary."
    )

    # ════════════════════════════════════════════════════════════
    # 5. ACCEPTANCE CRITERIA
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("5", "Acceptance Criteria")
    pdf.body_text(
        "Acceptance criteria define the conditions that must be met for each user story to be "
        "considered complete. They follow the Given-When-Then (BDD) format."
    )

    criteria = [
        ("US-01 Browse Menu",
         "Given the home page is loaded, When the food list API returns successfully, "
         "Then all available food items are displayed in a grid layout."),
        ("US-02 Filter by Category",
         "Given food items are displayed, When a customer selects a category, "
         "Then only items belonging to that category are shown."),
        ("US-03 Search Food",
         "Given the search bar is visible, When a customer types a food name, "
         "Then only matching items are shown; no results shows an empty state message."),
        ("US-04 Add to Cart",
         "Given a customer is on the menu page, When they click the + button on a food item, "
         "Then that item is added to the cart and the cart badge count increases."),
        ("US-05 Update Cart Quantities",
         "Given items are in the cart, When a customer changes the quantity, "
         "Then the subtotal and total price update immediately."),
        ("US-06 Register",
         "Given the registration form is displayed, When a customer submits valid name, email, "
         "and a password of >= 6 characters, Then a new user account is created and the customer "
         "receives a JWT token."),
        ("US-07 Social Login",
         "Given the login modal is open, When a customer clicks Sign in with Google and "
         "completes the Firebase popup, Then the customer is logged in and a JWT is stored."),
        ("US-08 Delivery Address",
         "Given the customer is at the checkout page, When all address fields are filled, "
         "Then the Place Order button becomes active."),
        ("US-09 Online Payment",
         "Given the order has been placed, When the customer completes Stripe Checkout, "
         "Then the order payment field is set to true and the cart is cleared."),
        ("US-10 View Past Orders",
         "Given a customer is logged in, When they navigate to My Orders, "
         "Then all their previous orders are listed with status and total amount."),
        ("US-11 Email Notification",
         "Given an admin updates an order status, When the update is saved, "
         "Then the customer receives an HTML email containing the new status."),
        ("US-12 Cancel Order",
         "Given an order has not yet been marked as Out for Delivery, When the customer clicks "
         "Cancel, Then the order status is updated to Cancelled."),
        ("US-13 Add Food Item",
         "Given the admin is on the Add page with all fields filled and an image selected, "
         "When they submit the form, Then the food item appears in the database and on the List page."),
        ("US-14 Remove Food Item",
         "Given the admin is on the List page, When they click the delete icon for an item, "
         "Then the item is removed from the database and disappears from the list."),
        ("US-15 View All Orders",
         "Given the admin is on the Orders page, When the page loads, "
         "Then all orders are fetched and displayed with customer address, items, and status."),
        ("US-16 Update Order Status",
         "Given an order is visible in the admin Orders page, When the admin selects a new "
         "status from the dropdown, Then the order status is updated in the database immediately."),
        ("US-17 Analytics Dashboard",
         "Given the admin opens the Dashboard, When orders are loaded, "
         "Then total orders, total revenue, and status breakdown cards are displayed."),
        ("US-18 Filter Orders by Period",
         "Given the admin is on the Orders page, When they select a time filter "
         "(Today / Week / Month / Year), Then only orders within that period are shown."),
        ("US-19 Edit Food Item",
         "Given the admin is on the List page, When they edit a food item and save, "
         "Then the changes are persisted and visible immediately."),
    ]

    for story, criterion in criteria:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(*ReportPDF.DARK)
        pdf.cell(0, 7, story, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*ReportPDF.GRAY)
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(190, 5, criterion)
        pdf.ln(2)

    # ════════════════════════════════════════════════════════════
    # 6. DIAGRAMS
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("6", "Diagrams")

    pdf.sub_title("6.1 System Context Diagram")
    pdf.body_text(
        "The context diagram shows the Food Delivery Platform and its external actors/systems."
    )
    pdf.set_font("Courier", "", 8)
    ctx_lines = [
        "                          +--------------------+",
        "   [Customer]  <-------> |                    | <------> [Stripe API]",
        "                          |  Food Delivery     |",
        "   [Admin]     <-------> |  Platform          | <------> [Firebase]",
        "                          |  (MERN Backend)    |",
        "                          |                    | <------> [MongoDB]",
        "                          +--------------------+",
        "                                   |",
        "                          <------> [Nodemailer / SMTP]",
    ]
    for line in ctx_lines:
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("6.2 Three-Tier Architecture Diagram")
    pdf.set_font("Courier", "", 8)
    arch_lines = [
        "+-----------------------------+   +-----------------------------+",
        "|     PRESENTATION TIER       |   |     PRESENTATION TIER       |",
        "|  Customer Frontend          |   |  Admin Panel                |",
        "|  React 19 + Vite + Router   |   |  React 18 + Vite + Router   |",
        "+-------------+---------------+   +-------------+---------------+",
        "              |                                 |",
        "              +----------------+----------------+",
        "                               |",
        "              +----------------v-----------------+",
        "              |      APPLICATION TIER            |",
        "              |  Express.js Backend API          |",
        "              |  Routes -> Controllers ->        |",
        "              |  Services -> Models              |",
        "              +-----+----------+----------+------+",
        "                    |          |          |",
        "             +------v--+ +-----v--+ +-----v----+",
        "             |  DATA   | |PAYMENT | |  AUTH    |",
        "             | MongoDB | | Stripe | | Firebase |",
        "             +---------+ +--------+ +----------+",
    ]
    for line in arch_lines:
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("6.3 Order Lifecycle Flow Diagram")
    pdf.set_font("Courier", "", 8)
    flow_lines = [
        "[Customer adds items] --> [Cart page: review & confirm]",
        "       |",
        "       v",
        "[Enter delivery address] --> [POST /api/order/place]",
        "       |",
        "       v",
        "[Stripe Checkout Session created] --> [Redirect to Stripe]",
        "       |",
        "       v (payment success)",
        "[POST /api/order/verify] --> [Order.payment = true]",
        "       |                   --> [Cart cleared]",
        "       v",
        "[Admin updates status] --> [POST /api/order/status]",
        "       |                --> [Email sent to customer]",
        "       v",
        "[Order Delivered]",
    ]
    for line in flow_lines:
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("6.4 Authentication Flow Diagram")
    pdf.set_font("Courier", "", 8)
    auth_lines = [
        "Email/Password Login:                 Social Login (Google/Facebook):",
        "                                                                      ",
        "[Login Form]                          [Social Button Clicked]         ",
        "     |                                       |                        ",
        "     v                                       v                        ",
        "[POST /api/user/login]                [Firebase signInWithPopup]      ",
        "     |                                       |                        ",
        "     v                                       v                        ",
        "[bcrypt.compare password]             [Firebase returns user profile] ",
        "     |                                       |                        ",
        "     v                                       v                        ",
        "[JWT issued (7 days)]                 [POST /api/user/social-login]   ",
        "     |                                       |                        ",
        "     v                                       v                        ",
        "[Token stored in browser]             [JWT issued & stored]           ",
    ]
    for line in auth_lines:
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # ════════════════════════════════════════════════════════════
    # 7. DATABASE DESIGN
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("7", "Database Design")
    pdf.body_text(
        "The system uses MongoDB as its NoSQL database with Mongoose as the Object-Document Mapper. "
        "MongoDB stores data as flexible JSON-like documents within three main collections: "
        "users, foods, and orders."
    )

    pdf.sub_title("7.1 Entity-Relationship Diagram (Conceptual)")
    pdf.set_font("Courier", "", 8)
    erd_lines = [
        "+------------------+          +------------------+",
        "|      USERS       |          |      FOODS       |",
        "+------------------+          +------------------+",
        "| _id (ObjectId)   |          | _id (ObjectId)   |",
        "| name             |          | name             |",
        "| email (unique)   |          | description      |",
        "| password (hash)  |          | price            |",
        "| cartData (map)   |          | image (filename) |",
        "| resetPwdToken    |          | category         |",
        "| resetPwdExpire   |          | isAvailable      |",
        "| createdAt        |          | createdAt        |",
        "| updatedAt        |          | updatedAt        |",
        "+--------+---------+          +------------------+",
        "         |                            ^",
        "         | 1                          | referenced via",
        "         |                            | items[].name",
        "         v  M                         |",
        "+------------------+                  |",
        "|      ORDERS      +------------------+",
        "+------------------+",
        "| _id (ObjectId)   |",
        "| userId (String)  | --> references users._id",
        "| items (Array)    |     [{name, quantity}]",
        "| amount (Number)  |",
        "| address (Object) |     {firstName, lastName,",
        "|                  |      street, city, state,",
        "|                  |      country, zipcode, phone}",
        "| status (String)  |",
        "| date (Date)      |",
        "| payment (Bool)   |",
        "+------------------+",
    ]
    for line in erd_lines:
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("7.2 Users Collection Schema")
    pdf.table(
        ["Field", "Type", "Constraints", "Description"],
        [
            ["name", "String", "Required", "Customer full name"],
            ["email", "String", "Required, Unique", "Login email address"],
            ["password", "String", "Required", "bcrypt hashed password"],
            ["cartData", "Object", "Default: {}", "Map of foodId -> quantity"],
            ["resetPasswordToken", "String", "Optional", "Password reset token"],
            ["resetPasswordExpire", "Date", "Optional", "Token expiry timestamp"],
            ["createdAt", "Date", "Auto", "Record creation time"],
            ["updatedAt", "Date", "Auto", "Record last update time"],
        ],
        [38, 28, 38, 86],
    )

    pdf.sub_title("7.3 Foods Collection Schema")
    pdf.table(
        ["Field", "Type", "Constraints", "Description"],
        [
            ["name", "String", "Required, text-indexed", "Food item name"],
            ["description", "String", "Required, text-indexed", "Detailed description"],
            ["price", "Number", "Required, min: 0", "Item price in USD"],
            ["image", "String", "Required", "Stored filename of uploaded image"],
            ["category", "String", "Required, text-indexed", "Cuisine / food category"],
            ["isAvailable", "Boolean", "Default: true", "Visibility on customer menu"],
            ["createdAt", "Date", "Auto", "Record creation time"],
            ["updatedAt", "Date", "Auto", "Record last update time"],
        ],
        [38, 28, 38, 86],
    )

    pdf.sub_title("7.4 Orders Collection Schema")
    pdf.table(
        ["Field", "Type", "Constraints", "Description"],
        [
            ["userId", "String", "Required", "References users._id"],
            ["items", "Array", "Required", "Array of {name, quantity}"],
            ["amount", "Number", "Required", "Total order amount in USD"],
            ["address", "Object", "Required", "Delivery address sub-document"],
            ["status", "String", "Default: 'Food Processing'", "Current order lifecycle status"],
            ["date", "Date", "Default: Date.now", "Order placement timestamp"],
            ["payment", "Boolean", "Default: false", "True after Stripe payment confirmed"],
        ],
        [38, 28, 44, 80],
    )

    pdf.sub_title("7.5 Database Design Decisions")
    pdf.bullet("MongoDB (NoSQL) was chosen for its flexible schema, allowing cartData and address "
               "to be stored as embedded documents without requiring relational joins.")
    pdf.bullet("Text indexes on foods.name, foods.description, and foods.category enable "
               "full-text search queries via a single $text operator.")
    pdf.bullet("cartData is stored as a map on the User document to avoid a separate Cart "
               "collection, simplifying synchronisation between browser and server.")
    pdf.bullet("Order items are embedded arrays (not references) to preserve a historical "
               "snapshot of what was ordered, even if a food item is later deleted.")
    pdf.bullet("Timestamps (createdAt / updatedAt) are auto-managed by Mongoose on all collections.")

    # ════════════════════════════════════════════════════════════
    # 8. CLASS DESIGN
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("8", "Class Design")
    pdf.body_text(
        "The system is fully designed using ES6 classes. The following sections present the "
        "class hierarchy and responsibilities for each application layer."
    )

    pdf.sub_title("8.1 Backend Class Diagram")
    pdf.set_font("Courier", "", 7.5)
    backend_cls = [
        "+--------------------+      +---------------------------+",
        "|      Database      |      |         Server            |",
        "+--------------------+      +---------------------------+",
        "| - #instance        |      | - app: Express            |",
        "| - connection       |      | - port: Number            |",
        "+--------------------+      +---------------------------+",
        "| + getInstance()    |      | + configureMiddleware()   |",
        "| + connect(uri)     |      | + configureRoutes()       |",
        "+--------------------+      | + start()                 |",
        "                            +---------------------------+",
        "",
        "+--------------------+      +---------------------------+",
        "|     UserModel      |      |        FoodModel          |",
        "+--------------------+      +---------------------------+",
        "| - schema           |      | - schema                  |",
        "| - model (Mongoose) |      | - model (Mongoose)        |",
        "+--------------------+      +---------------------------+",
        "| + create(data)     |      | + create(data)            |",
        "| + findById(id)     |      | + findById(id)            |",
        "| + findByEmail(e)   |      | + findAll()               |",
        "| + updateCart(...)  |      | + updateById(id, data)    |",
        "| + clearCart(id)    |      | + deleteById(id)          |",
        "+--------------------+      | + search(query)           |",
        "                            +---------------------------+",
        "",
        "+--------------------+      +---------------------------+",
        "|    OrderModel      |      |     AuthMiddleware        |",
        "+--------------------+      +---------------------------+",
        "| - schema           |      | + generateToken(userId)   |",
        "| - model (Mongoose) |      | + verifyToken(req,res,nxt)|",
        "+--------------------+      +---------------------------+",
        "| + create(data)     |",
        "| + findById(id)     |      +---------------------------+",
        "| + findByUserId(id) |      |   FileUploadMiddleware    |",
        "| + updateStatus(..) |      +---------------------------+",
        "| + updatePayment(.) |      | + upload (Multer config)  |",
        "+--------------------+      +---------------------------+",
    ]
    for line in backend_cls:
        pdf.cell(0, 4, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("8.2 Backend Service Classes")
    pdf.set_font("Courier", "", 7.5)
    svc_cls = [
        "+---------------------+    +---------------------+",
        "|    UserService      |    |     FoodService     |",
        "+---------------------+    +---------------------+",
        "| - userModel         |    | - foodModel         |",
        "+---------------------+    +---------------------+",
        "| + register(data)    |    | + addFood(data,file)|",
        "| + login(email,pwd)  |    | + listFoods()       |",
        "| + getProfile(id)    |    | + removeFood(id)    |",
        "| + updateProfile(.)  |    | + updateFood(id,d)  |",
        "| + socialLogin(prof) |    | + searchFood(q)     |",
        "+---------------------+    +---------------------+",
        "",
        "+---------------------+    +---------------------+",
        "|    OrderService     |    |    CartService      |",
        "+---------------------+    +---------------------+",
        "| - orderModel        |    | - userModel         |",
        "| - stripeService     |    +---------------------+",
        "| - emailService      |    | + addToCart(uid,fid)|",
        "+---------------------+    | + removeFromCart(.) |",
        "| + placeOrder(data)  |    | + getCart(userId)   |",
        "| + verifyPayment(.)  |    | + clearCart(userId) |",
        "| + getUserOrders(id) |    +---------------------+",
        "| + listOrders()      |",
        "| + updateStatus(.)   |    +---------------------+",
        "| + cancelOrder(.)    |    |   StripeService     |",
        "+---------------------+    +---------------------+",
        "                           | + createSession(.)  |",
        "                           +---------------------+",
    ]
    for line in svc_cls:
        pdf.cell(0, 4, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("8.3 Admin Panel Class Diagram")
    pdf.set_font("Courier", "", 7.5)
    admin_cls = [
        "+---------------------+    +---------------------+",
        "|    ApiService       |    |   FoodRepository    |",
        "+---------------------+    +---------------------+",
        "| - #instance         |    | - apiService        |",
        "| - axiosClient       |    +---------------------+",
        "+---------------------+    | + getAll()          |",
        "| + getInstance()     |    | + add(formData)     |",
        "| + get(url)          |    | + remove(id)        |",
        "| + post(url,data)    |    | + update(id, data)  |",
        "| + postForm(url,fd)  |    +---------------------+",
        "+---------------------+",
        "                           +---------------------+",
        "+---------------------+    |  OrderRepository    |",
        "|   FoodFormFactory   |    +---------------------+",
        "+---------------------+    | - apiService        |",
        "| + createEmpty()     |    +---------------------+",
        "| + create(overrides) |    | + getAll()          |",
        "| + withField(d,k,v)  |    | + updateStatus(.)   |",
        "+---------------------+    +---------------------+",
        "",
        "+---------------------+    +---------------------+",
        "|     EventBus        |    | OrderFilterContext  |",
        "+---------------------+    +---------------------+",
        "| - #instance         |    | + filter(orders,key)|",
        "| - listeners: Map    |    | + getByKey(key)     |",
        "+---------------------+    +---------------------+",
        "| + getInstance()     |           ^",
        "| + on(event, cb)     |           | implements",
        "| + emit(event, data) |    +------+-------+------+",
        "| + off(event, cb)    |    |AllTime|Today  |Month |",
        "+---------------------+    |Strat. |Strat. |Strat.|",
        "                           +-------+-------+------+",
    ]
    for line in admin_cls:
        pdf.cell(0, 4, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("8.4 Admin Domain Model Classes")
    pdf.table(
        ["Class", "Key Properties", "Key Methods / Computed Getters"],
        [
            ["Order", "_id, amount, status, date, items[], address",
             "shortId, formattedAmount, formattedDate, itemSummary, statusClass, isWithin(period)"],
            ["OrderItem", "name, quantity",
             "toString()"],
            ["Address", "firstName, lastName, street, city, state, country, zipcode, phone",
             "fullName, cityLine, singleLine"],
            ["FoodItem", "_id, name, description, price, image, category, isAvailable",
             "formattedPrice"],
            ["DashboardStats", "orders[], totalOrders, totalRevenue",
             "formattedRevenue, statusCounts, statusBreakdown"],
        ],
        [30, 68, 92],
    )

    # ════════════════════════════════════════════════════════════
    # 9. IMPLEMENTATION OVERVIEW
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("9", "Implementation Overview")

    pdf.sub_title("9.1 Development Methodology")
    pdf.body_text(
        "The project was developed using an Agile-inspired iterative approach. Features were "
        "implemented in priority order: the core ordering flow first, then the admin panel, "
        "then social login and analytics. Each iteration produced a working vertical slice of "
        "the system from database schema to UI."
    )

    pdf.sub_title("9.2 Project File Structure")
    pdf.set_font("Courier", "", 8)
    structure_lines = [
        "Food-Del_upadated/",
        "|-- package.json                  (Root config)",
        "|-- generate_report.py            (This report generator)",
        "|-- backend/",
        "|   |-- src/",
        "|   |   |-- server.js             (Server class - entry point)",
        "|   |   |-- config/Database.js    (Singleton DB connection)",
        "|   |   |-- controllers/          (CartController, FoodController,",
        "|   |   |                          OrderController, UserController)",
        "|   |   |-- middleware/            (AuthMiddleware, FileUploadMiddleware)",
        "|   |   |-- models/               (FoodModel, OrderModel, UserModel)",
        "|   |   |-- routes/               (CartRoute, FoodRoute, OrderRoute, UserRoute)",
        "|   |   +-- services/             (CartService, EmailService, FoodService,",
        "|   |                              OrderService, StripeService, UserService)",
        "|   +-- uploads/                  (Food images)",
        "|-- frontend/",
        "|   |-- adapters/RepositoryAdapter.js  (Adapter pattern)",
        "|   |-- src/",
        "|   |   |-- App.jsx               (Router + AnimatePresence)",
        "|   |   |-- context/StoreContext.jsx   (Global state)",
        "|   |   |-- services/authService.js    (Firebase auth)",
        "|   |   |-- components/           (22 components with tests)",
        "|   |   +-- pages/                (7 pages)",
        "+-- admin/",
        "    +-- src/",
        "        |-- App.jsx               (Composition root + DI)",
        "        |-- services/ApiService.js     (Singleton HTTP client)",
        "        |-- repositories/         (FoodRepository, OrderRepository)",
        "        |-- models/index.js        (Order, FoodItem, DashboardStats)",
        "        |-- strategies/OrderFilterStrategy.js  (Strategy pattern)",
        "        |-- factories/FoodFormFactory.js        (Factory pattern)",
        "        |-- events/EventBus.js                  (Observer pattern)",
        "        |-- components/  and  pages/",
    ]
    for line in structure_lines:
        pdf.cell(0, 4, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("9.3 Key Technical Decisions")
    pdf.bullet("MERN stack chosen for JavaScript consistency across frontend, backend, and "
               "scripting, reducing the cognitive overhead of context-switching.")
    pdf.bullet("MongoDB preferred over SQL for its schema-less flexibility, which suits the "
               "evolving nature of menu items and order metadata.")
    pdf.bullet("React Context API used instead of Redux to manage global state, keeping the "
               "dependency footprint small for a project of this scale.")
    pdf.bullet("Vite selected as the build tool for both frontend and admin for its fast HMR "
               "and near-instant cold starts during development.")
    pdf.bullet("Stripe Checkout (hosted page) used instead of a custom card form to simplify "
               "PCI compliance; no raw card data ever touches the application servers.")
    pdf.bullet("Firebase social login offloads identity verification to a trusted provider "
               "without requiring the app to handle OAuth flows directly.")

    # ════════════════════════════════════════════════════════════
    # 10. BACKEND IMPLEMENTATION
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("10", "Backend Implementation")

    pdf.sub_title("10.1 Architecture Layers")
    pdf.body_text(
        "The backend follows a strict layered OOP architecture. Every layer is implemented as "
        "ES6 classes and exported as singleton instances to guarantee a single shared state."
    )
    pdf.bullet("Server (server.js)  -  Application entry point; initialises middleware, "
               "routes, and the DB connection.")
    pdf.bullet("Routes  -  Thin routing layer that maps HTTP verbs to controller methods and "
               "attaches middleware.")
    pdf.bullet("Controllers  -  Receive requests, delegate to services, and return responses. "
               "No business logic lives here.")
    pdf.bullet("Services  -  Contain all business logic (CartService, FoodService, OrderService, "
               "UserService, StripeService, EmailService).")
    pdf.bullet("Models  -  Mongoose schema definitions wrapped in OOP classes with async CRUD "
               "helper methods.")
    pdf.bullet("Middleware  -  Cross-cutting concerns: AuthMiddleware (JWT verification), "
               "FileUploadMiddleware (Multer image upload).")
    pdf.bullet("Config  -  Database singleton that manages the MongoDB connection lifecycle.")

    pdf.sub_title("10.2 Server Initialisation")
    pdf.body_text(
        "The Server class (server.js) is the composition root. It initialises Express, configures "
        "CORS (cross-origin), JSON body parsing, and express-rate-limit (100 requests per 15-minute "
        "window). It registers all route modules under /api/*, serves static files from /uploads, "
        "and starts listening on the configured port after a successful DB connection."
    )

    pdf.sub_title("10.3 Model Layer")
    pdf.table(
        ["Model Class", "Mongoose Collection", "Key Methods"],
        [
            ["UserModel", "users",  "create, findByEmail, findById, updateById, updateCart, clearCart"],
            ["FoodModel", "foods",  "create, findAll, findById, updateById, deleteById, search (text)"],
            ["OrderModel", "orders", "create, findById, findByUserId, updateStatus, updatePaymentStatus"],
        ],
        [35, 35, 120],
    )

    pdf.sub_title("10.4 Service Layer")
    pdf.table(
        ["Service", "Responsibility"],
        [
            ["UserService",   "Registration, login, password hashing, JWT creation, profile management, social login"],
            ["FoodService",   "CRUD operations on food items, image handling via Multer, full-text search"],
            ["CartService",   "Add / remove / get / clear cart items for authenticated users"],
            ["OrderService",  "Place orders, verify payments, track status, handle cancellation"],
            ["StripeService", "Create Stripe Checkout Sessions with line items and delivery fee"],
            ["EmailService",  "Send HTML transactional emails via Nodemailer on status changes"],
        ],
        [38, 152],
    )

    pdf.sub_title("10.5 Authentication & Security Implementation")
    pdf.bullet("JWT  -  Tokens signed with HS256, 7-day expiry. Token sent in 'token' request header.")
    pdf.bullet("bcryptjs  -  Passwords hashed with 10 salt rounds before storage; compared on login.")
    pdf.bullet("Validator  -  Input validation (email format, minimum password length) in UserService.")
    pdf.bullet("Rate Limiting  -  100 requests / 15 min per IP via express-rate-limit.")
    pdf.bullet("CORS  -  Enabled globally to permit requests from the React frontend and admin domains.")
    pdf.bullet("Payment Verification  -  Order payment endpoint checks Stripe session ID before "
               "marking an order as paid to prevent tampering.")

    pdf.sub_title("10.6 Third-Party Integrations")
    pdf.bullet("Stripe  -  StripeService.createSession() builds a Checkout Session with line items "
               "(food items) plus a $2 delivery fee line item. Success and cancel redirect URLs are "
               "passed so Stripe knows where to redirect after payment.")
    pdf.bullet("Firebase  -  After signInWithPopup(), the frontend sends the user profile to "
               "/api/user/social-login. The backend creates or retrieves the user and issues a JWT.")
    pdf.bullet("Nodemailer  -  EmailService is configured with SMTP credentials from .env. It sends "
               "an HTML email to the customer's address whenever the admin updates order status.")

    # ════════════════════════════════════════════════════════════
    # 11. DESIGN PATTERNS IMPLEMENTED
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("11", "Design Patterns Implemented")
    pdf.body_text(
        "The platform deliberately applies multiple GoF (Gang of Four) and architectural design "
        "patterns to achieve maintainability, testability, and extensibility. Each pattern is "
        "documented below with its location, description, and purpose."
    )

    patterns = [
        (
            "Singleton",
            "Backend: Database, all Models, all Services. Admin: ApiService, EventBus.",
            "Ensures only one instance of a class exists throughout the application lifetime. "
            "Database.js uses a private static #instance field with getInstance() so the "
            "MongoDB connection is opened once and shared. All Model and Service classes are "
            "exported as 'export default new ClassName()' - a module-level singleton. "
            "ApiService in the admin panel uses the same private static field pattern.",
            "Prevents multiple database connections; guarantees a single Axios client "
            "instance with consistent interceptors; avoids duplicated in-memory state."
        ),
        (
            "Repository",
            "Admin: FoodRepository, OrderRepository.",
            "Encapsulates all data-access (HTTP) calls behind a clean interface. Components "
            "never call Axios directly; they call repository methods (getAll, add, remove, "
            "updateStatus). This keeps HTTP details out of UI components.",
            "Decouples the UI from the data source. The backend URL, request format, or even "
            "the entire API can be swapped without touching a single component."
        ),
        (
            "Strategy",
            "Admin: OrderFilterStrategy.js - AllTimeStrategy, TodayStrategy, WeekStrategy, "
            "MonthStrategy, YearStrategy.",
            "Defines a family of interchangeable algorithms (time-period order filters) "
            "and selects one at runtime. OrderFilterContext.filter(orders, key) picks the "
            "correct strategy from a registry map and applies it.",
            "Satisfies the Open/Closed Principle - adding a new filter requires only a new "
            "class; no existing code changes."
        ),
        (
            "Factory",
            "Admin: FoodFormFactory.js.",
            "Centralises the creation of FoodFormData value objects. Provides static methods "
            "createEmpty(), create(overrides), and withField(existing, key, value). "
            "withField() returns a new immutable object instead of mutating state.",
            "Prevents scattered object construction logic. Immutable updates are safer in "
            "React state; the factory ensures all required fields are always present."
        ),
        (
            "Observer (Pub/Sub)",
            "Admin: EventBus.js.",
            "A singleton event bus that allows components to communicate without direct "
            "references. Components call eventBus.on(EVENT, callback) to subscribe and "
            "eventBus.emit(EVENT, payload) to publish. Named constants (FOOD_ADDED, "
            "FOOD_REMOVED, ORDER_STATUS_CHANGED, SIDEBAR_TOGGLE) replace magic strings.",
            "Decouples producers from consumers - the Add page emits FOOD_ADDED without "
            "knowing which components listen. Reduces prop drilling and tight coupling."
        ),
        (
            "Adapter",
            "Frontend: adapters/RepositoryAdapter.js.",
            "Defines an IRepository interface and provides MongooseAdapter and SQLAdapter "
            "implementations, all created via a RepositoryFactory. This adapts different "
            "backend storage technologies to a single consistent interface.",
            "Allows the frontend to switch from MongoDB to SQL (or any other data source) "
            "without modifying consuming components; only the adapter changes."
        ),
        (
            "Dependency Injection",
            "Admin: App.jsx - ServiceContext.",
            "Services (ApiService, FoodRepository, OrderRepository) are instantiated once in "
            "App.jsx and injected into the entire component tree via React Context "
            "(ServiceContext). Components call useServices() to access injected dependencies.",
            "Improves testability (mock services can be injected in tests), removes hard-coded "
            "dependencies from components, and supports a single composition root."
        ),
        (
            "MVC / Layered Architecture",
            "Backend: Routes -> Controllers -> Services -> Models.",
            "A strict layered pattern where each layer has a single responsibility: Routes "
            "map HTTP verbs, Controllers handle request/response, Services contain business "
            "logic, Models handle database operations. No layer bypasses another.",
            "Enforces the Single Responsibility Principle. Adding a new feature requires "
            "predictable changes in each layer. Business logic is fully isolated from HTTP."
        ),
        (
            "Context (Global State)",
            "Frontend: StoreContext.jsx.",
            "React Context API provides global state (food_list, cartItems, token, loading) "
            "and shared functions (addToCart, removeFromCart, getTotalCartAmount) to all "
            "components without prop drilling. A custom useStore() hook is exposed.",
            "Avoids the complexity of Redux for a project of this scale while still "
            "providing a single source of truth for application-wide state."
        ),
        (
            "Service Layer",
            "Backend: CartService, FoodService, OrderService, UserService, StripeService, EmailService.",
            "All business logic is isolated in dedicated Service classes. Controllers are "
            "thin and contain no logic beyond parsing the request and formatting the response. "
            "Services are the only layer that communicates with Models or external APIs.",
            "Makes business logic independently testable (no HTTP context needed). "
            "Multiple controllers or triggers could reuse the same service in future."
        ),
    ]

    for i, (name, location, description, purpose) in enumerate(patterns):
        pdf.sub_title(f"11.{i+1}  {name} Pattern")
        pdf.set_font("Helvetica", "BI", 9)
        pdf.set_text_color(*ReportPDF.GRAY)
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(190, 5, f"Location: {location}")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(*ReportPDF.DARK)
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(190, 6, description)
        pdf.set_font("Helvetica", "I", 9)
        pdf.set_text_color(*ReportPDF.GRAY)
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(190, 5, f"Purpose: {purpose}")
        pdf.ln(3)

    # ════════════════════════════════════════════════════════════
    # 12. UI / GUI DESIGN
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("12", "UI / GUI Design")
    pdf.body_text(
        "The user interface is split into two React applications: the Customer Frontend and the "
        "Admin Panel. Both use React Router for navigation and react-toastify for notifications. "
        "The customer frontend uses Framer Motion for animated page transitions."
    )

    pdf.sub_title("12.1 Customer Frontend - Navigation Flow")
    pdf.set_font("Courier", "", 8)
    nav_lines = [
        "[Home /]",
        "  |-- Header (hero banner + CTA)",
        "  |-- FeaturedCategories (category cards)",
        "  |-- ExploreMenu (horizontal category filter)",
        "  |-- FoodDisplay (filterable food grid)",
        "  |-- OurServices, SpecialSections, AppDownload",
        "  +-- Footer",
        "",
        "[Menu /menu] --> FoodDisplay (full catalogue)",
        "",
        "[Cart /cart] --> Cart (item list, quantities, subtotal, delivery fee, total)",
        "  |",
        "  v",
        "[Place Order /order] --> Delivery address form --> Stripe redirect",
        "  |",
        "  v",
        "[Verify /verify] --> Payment verification spinner --> redirect",
        "",
        "[My Orders /myorders] --> Order history table with status badges",
        "",
        "[Login Modal (overlay)] --> Email/Password form | Google/Facebook buttons",
    ]
    for line in nav_lines:
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("12.2 Customer Frontend - Component Hierarchy")
    pdf.table(
        ["Component", "Parent / Location", "Responsibility"],
        [
            ["Navbar", "App.jsx (persistent)", "Navigation links, cart item count badge, login trigger"],
            ["Header", "Home page", "Hero image banner with CTA button"],
            ["ExploreMenu", "Home page", "Horizontal scrollable category selector"],
            ["FeaturedCategories", "Home page", "Animated category showcase cards"],
            ["FoodDisplay", "Home / Menu pages", "Grid of FoodItem cards filtered by category"],
            ["FoodItem", "FoodDisplay", "Card with image, name, price, and +/- quantity controls"],
            ["Login", "Navbar (modal)", "Email+password form and social login buttons"],
            ["Cart", "Cart page", "Item list with subtotal, delivery fee, and checkout button"],
            ["OrderConfirmation", "Verify page", "Success/failure message after payment redirect"],
            ["Footer", "App.jsx (persistent)", "Links, social icons, copyright"],
            ["BackToTop", "App.jsx", "Floating scroll-to-top button"],
            ["ScrollToTop", "App.jsx", "Auto-scrolls to top on route change"],
            ["OurServices", "Home page", "Service highlights (fast delivery, 24/7 support, etc.)"],
            ["SpecialSections", "Home page", "Promotional banners and marketing content"],
            ["AppDownload", "Home page", "Mobile app download call-to-action section"],
        ],
        [42, 45, 103],
    )

    pdf.sub_title("12.3 Customer Frontend - UI/UX Design Principles")
    pdf.bullet("Responsive Layout  -  CSS Grid and Flexbox ensure the interface adapts from "
               "mobile (single column) to desktop (multi-column) without a CSS framework.")
    pdf.bullet("Animated Transitions  -  Framer Motion AnimatePresence wraps route changes, "
               "providing smooth fade/slide animations between pages.")
    pdf.bullet("Cart Badge  -  Real-time item count displayed on the Navbar cart icon, "
               "derived from the StoreContext cartItems map.")
    pdf.bullet("Toast Notifications  -  react-toastify displays contextual feedback "
               "(success / error / info) for all user actions.")
    pdf.bullet("Loading States  -  A loading flag in StoreContext prevents rendering the food "
               "grid until the API call completes, avoiding layout shifts.")
    pdf.bullet("Colour Palette  -  Orange accent (#FF6400) on a warm off-white background "
               "creates a warm, appetising feel consistent with food delivery branding.")

    pdf.sub_title("12.4 Admin Panel - Navigation Flow")
    pdf.set_font("Courier", "", 8)
    admin_nav_lines = [
        "+------------------------------------+",
        "|  Navbar (logo + user info)         |",
        "+--------+---------+--------+--------+",
        "| Sidebar|Dashboard|  Add   |  List  |  Orders |",
        "+--------+---------+--------+--------+---------+",
        "",
        "/ or /dashboard --> Dashboard.jsx",
        "  |-- Total Orders card",
        "  |-- Total Revenue card",
        "  +-- Status breakdown cards",
        "",
        "/add --> Add.jsx",
        "  |-- Image upload preview",
        "  |-- Name, Description, Category inputs",
        "  +-- Price input + Submit button",
        "",
        "/list --> List.jsx",
        "  +-- Food items table (image, name, category, price, delete button)",
        "",
        "/orders --> Orders.jsx",
        "  |-- Time-period filter (All / Today / Week / Month / Year)",
        "  +-- Orders table (status, customer address, items, amount, dropdown)",
    ]
    for line in admin_nav_lines:
        pdf.cell(0, 4.5, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.sub_title("12.5 Admin Panel - UI/UX Design Principles")
    pdf.bullet("Sidebar Navigation  -  A collapsible sidebar provides quick access to all "
               "admin pages, with active-state highlighting for the current route.")
    pdf.bullet("Data Tables  -  Order and food items are displayed in clean tabular layouts "
               "with alternating row colours for readability.")
    pdf.bullet("Status Dropdown  -  Order status can be updated inline from the Orders table "
               "without navigating away, reducing admin workflow friction.")
    pdf.bullet("Analytics Cards  -  The Dashboard displays key metrics in summary cards "
               "styled with colour-coded status indicators.")
    pdf.bullet("Image Preview  -  When an admin selects a food image on the Add page, a "
               "live preview is shown before submission.")
    pdf.bullet("Toast Feedback  -  All API responses (success or error) are surfaced as "
               "toasts to keep the admin informed of every operation outcome.")

    # ════════════════════════════════════════════════════════════
    # 13. TECHNOLOGY STACK
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("13", "Technology Stack")

    pdf.sub_title("Backend")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["Node.js",             "v16+",  "JavaScript runtime environment"],
            ["Express.js",          "4.18",  "HTTP server and routing framework"],
            ["MongoDB",             "v5+",   "NoSQL document database"],
            ["Mongoose",            "8.1",   "Object-Document Mapper (ODM) for MongoDB"],
            ["Stripe",              "14.14", "Payment processing and checkout sessions"],
            ["JSON Web Token",      "9.0",   "Stateless authentication tokens"],
            ["bcryptjs",            "2.4",   "Password hashing and verification"],
            ["Multer",              "1.4",   "Multipart file upload handling"],
            ["Nodemailer",          "8.0",   "Transactional email via SMTP"],
            ["express-rate-limit",  "7.5",   "API rate limiting per IP"],
            ["dotenv",              "16.4",  "Environment variable configuration"],
            ["validator",           "13.11", "Input validation (email, length, etc.)"],
            ["CORS",                "2.8",   "Cross-Origin Resource Sharing middleware"],
            ["Nodemon",             "3.0",   "Development hot-reload"],
        ],
        [50, 30, 110],
    )

    pdf.sub_title("Customer Frontend")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["React",               "19.2",  "UI component library"],
            ["React Router DOM",    "7.12",  "Client-side routing"],
            ["Vite",                "7.2",   "Build tool and development server"],
            ["Axios",               "1.13",  "Promise-based HTTP client"],
            ["Firebase",            "12.9",  "Social authentication (Google, Facebook)"],
            ["Framer Motion",       "12.29", "Page transition animations"],
            ["React Toastify",      "11.0",  "Toast notification system"],
            ["Vitest",              "4.0",   "Unit testing framework"],
            ["Testing Library",     "16.3",  "Component and DOM testing utilities"],
            ["ESLint",              "9.39",  "Static code analysis and linting"],
        ],
        [50, 30, 110],
    )

    pdf.sub_title("Admin Panel")
    pdf.table(
        ["Technology", "Version", "Purpose"],
        [
            ["React",            "18.2", "UI component library"],
            ["React Router DOM", "6.18", "Client-side routing"],
            ["Vite",             "4.5",  "Build tool and development server"],
            ["Axios",            "1.6",  "HTTP client for API calls"],
            ["React Toastify",   "9.1",  "Toast notification system"],
            ["Vitest",           "0.34", "Unit testing framework"],
        ],
        [50, 30, 110],
    )

    # ════════════════════════════════════════════════════════════
    # 14. TESTING STRATEGY
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("14", "Testing Strategy")

    pdf.sub_title("14.1 Testing Framework")
    pdf.body_text(
        "The project uses Vitest as the test runner with @testing-library/react for component "
        "testing and @testing-library/jest-dom for DOM assertions. JSDOM provides a simulated "
        "browser environment. Tests can be run via 'npm test' (watch mode) or "
        "'npm run test:ui' for a browser-based test UI."
    )

    pdf.sub_title("14.2 Frontend Test Coverage")
    pdf.table(
        ["Test File", "Component / Page Tested", "Scenarios Covered"],
        [
            ["App.test.jsx",          "App - routing and layout",       "Route rendering, persistent layout"],
            ["Navbar.test.jsx",       "Navbar component",               "Logo, navigation links, cart badge"],
            ["header.test.jsx",       "Header / hero section",          "Heading text, CTA button"],
            ["explore-menu.test.jsx", "Explore menu component",         "Category rendering, selection"],
            ["FoodDisply.test.jsx",   "Food display grid",              "Items render, category filter"],
            ["FoodItem.test.jsx",     "Individual food item card",       "Image, name, price, add button"],
            ["login.test.jsx",        "Login modal",                    "Form fields, submit, social buttons"],
            ["footer.test.jsx",       "Footer component",               "Links, social icons, copyright"],
            ["AppDownload.test.jsx",  "App download section",           "Store badges, links"],
            ["verify.test.jsx",       "Payment verification page",      "Success/failure states"],
        ],
        [45, 48, 97],
    )

    pdf.sub_title("14.3 Admin Panel Testing")
    pdf.body_text(
        "The admin panel has Vitest and Testing Library configured in its devDependencies "
        "and package.json scripts (test, test:ui). Domain model classes (Order, Address, "
        "FoodItem, DashboardStats) are pure JavaScript and can be unit-tested without any "
        "DOM environment."
    )

    pdf.sub_title("14.4 Testing Approach")
    pdf.bullet("Component Tests  -  Each React component is rendered in isolation with mocked "
               "context values. Tests assert that the correct text, buttons, and links appear.")
    pdf.bullet("Integration Tests  -  Key flows (add to cart, login, filter by category) are "
               "tested by rendering parent components with child dependencies included.")
    pdf.bullet("Unit Tests (Models)  -  Admin domain model classes are tested for correct "
               "computed properties (formattedAmount, shortId, statusClass) and pure methods.")
    pdf.bullet("Mocking  -  Axios and Firebase are mocked in tests to avoid real HTTP calls, "
               "ensuring tests are fast, deterministic, and offline-capable.")

    # ════════════════════════════════════════════════════════════
    # 15. FEASIBILITY ANALYSIS
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("15", "Feasibility Analysis")
    pdf.body_text(
        "This section evaluates the technical, economic, operational, and schedule feasibility "
        "of the Food Delivery Platform to confirm its viability as a production system."
    )

    pdf.sub_title("15.1 Technical Feasibility")
    pdf.body_text(
        "All technologies chosen are mature, well-supported, and widely deployed in production "
        "environments. The MERN stack has a large ecosystem, extensive documentation, and active "
        "community support. Each third-party integration (Stripe, Firebase, Nodemailer) provides "
        "official SDKs and sandbox/test environments."
    )
    pdf.table(
        ["Technical Aspect", "Status", "Justification"],
        [
            ["Node.js + Express backend", "Feasible", "Stable v16+ LTS; widely used for REST APIs"],
            ["MongoDB persistence",       "Feasible", "Mongoose ODM simplifies schema management"],
            ["React frontend (x2)",       "Feasible", "React 18/19 are production-ready; Vite is fast"],
            ["Stripe payments",           "Feasible", "Official SDK; sandbox available for full testing"],
            ["Firebase social login",     "Feasible", "Official JS SDK; test with emulator suite"],
            ["Email notifications",       "Feasible", "Nodemailer with any SMTP provider (e.g. Gmail)"],
            ["JWT authentication",        "Feasible", "Industry standard; jsonwebtoken library is mature"],
            ["Image uploads (Multer)",    "Feasible", "Well-tested middleware; scalable to cloud storage"],
            ["OOP + Design Patterns",     "Feasible", "ES6 classes fully supported; patterns are proven"],
        ],
        [62, 24, 104],
    )

    pdf.sub_title("15.2 Economic Feasibility")
    pdf.table(
        ["Cost Item", "Development", "Production (estimated)"],
        [
            ["Node.js / React",  "Free (open source)",  "Free"],
            ["MongoDB Atlas",    "Free tier available", "$9 - $57/month (M2-M5 cluster)"],
            ["Stripe",           "Free sandbox",        "2.9% + $0.30 per transaction"],
            ["Firebase Auth",    "Free tier (Spark)",   "Free up to 10,000 users/month"],
            ["Hosting (VPS)",    "localhost",            "$5 - $20/month (DigitalOcean etc.)"],
            ["Domain",           "localhost",            "~$12/year"],
            ["Email (SMTP)",     "Gmail (free)",        "Free - $20/month (SendGrid, etc.)"],
        ],
        [50, 55, 85],
    )
    pdf.body_text(
        "Total estimated production running cost is approximately $25 - $80 per month for a "
        "small-to-medium deployment. This is economically viable for a startup or small business."
    )

    pdf.sub_title("15.3 Operational Feasibility")
    pdf.bullet("Admin Panel  -  Provides a graphical interface requiring no technical knowledge "
               "to manage the food catalogue, orders, and customer communications.")
    pdf.bullet("Automated Notifications  -  Email alerts are sent automatically on status "
               "changes; no manual communication is required.")
    pdf.bullet("Rate Limiting & Security  -  Protections against brute-force and DDoS attacks "
               "are built in, reducing operational security overhead.")
    pdf.bullet("Environment Configuration  -  All secrets and URLs are managed via .env files, "
               "making deployment to different environments straightforward.")
    pdf.bullet("Modular Architecture  -  The three-application structure allows independent "
               "deployment and scaling of each sub-application.")

    pdf.sub_title("15.4 Schedule Feasibility")
    pdf.table(
        ["Phase", "Tasks", "Estimated Duration"],
        [
            ["1 - Backend Core",       "Database setup, models, auth, basic CRUD endpoints", "1 week"],
            ["2 - Customer Frontend",  "React SPA, routing, food display, cart, StoreContext", "1 week"],
            ["3 - Payments & Orders",  "Stripe integration, order flow, payment verification", "4 days"],
            ["4 - Admin Panel",        "Dashboard, food management, order management, patterns", "1 week"],
            ["5 - Auth & Social",      "JWT hardening, Firebase social login, email notifications", "3 days"],
            ["6 - Testing & Polish",   "Unit tests, responsive design, animations, bug fixes", "4 days"],
            ["7 - Documentation",      "README files, API docs, project report generation", "2 days"],
        ],
        [48, 90, 42],
    )

    pdf.sub_title("15.5 Feasibility Summary")
    pdf.table(
        ["Dimension", "Verdict", "Confidence"],
        [
            ["Technical",    "Fully Feasible",   "High  - all components proven in production worldwide"],
            ["Economic",     "Feasible",          "High  - low running costs; free tiers available"],
            ["Operational",  "Feasible",          "High  - admin UI requires no technical expertise"],
            ["Schedule",     "Feasible",          "Medium - 4-5 weeks for a skilled developer team"],
        ],
        [38, 38, 114],
    )

    # ════════════════════════════════════════════════════════════
    # 16. DEPLOYMENT & CONFIGURATION
    # ════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_title("16", "Deployment & Configuration")

    pdf.sub_title("16.1 Environment Variables")
    pdf.table(
        ["Variable", "Description", "Example"],
        [
            ["MONGODB_URI",       "MongoDB connection string",          "mongodb://localhost:27017/food-delivery"],
            ["JWT_SECRET",        "Secret key for JWT signing",         "(random 32-char string)"],
            ["STRIPE_SECRET_KEY", "Stripe API secret key",              "sk_test_..."],
            ["PORT",              "Backend server port",                "4000"],
            ["FRONTEND_URL",      "Frontend URL for Stripe redirects",  "http://localhost:5173"],
            ["VITE_API_URL",      "Backend URL for frontends",          "http://localhost:4000"],
            ["EMAIL_USER",        "SMTP email address",                 "your@gmail.com"],
            ["EMAIL_PASSWORD",    "SMTP email password / app password", "(app password)"],
            ["SMTP_HOST",         "SMTP server host",                   "smtp.gmail.com"],
            ["SMTP_PORT",         "SMTP server port",                   "587"],
        ],
        [45, 70, 75],
    )

    pdf.sub_title("16.2 Running the Project Locally")
    pdf.set_font("Courier", "", 9)
    commands = [
        "# 1. Clone the repository",
        "git clone <repo-url> && cd Food-Del_upadated",
        "",
        "# 2. Backend",
        "cd backend && npm install",
        "cp .env.example .env   # fill in env variables",
        "npm run dev            # runs on http://localhost:4000",
        "",
        "# 3. Customer Frontend (new terminal)",
        "cd frontend && npm install",
        "cp .env.example .env   # set VITE_API_URL",
        "npm run dev            # runs on http://localhost:5173",
        "",
        "# 4. Admin Panel (new terminal)",
        "cd admin && npm install",
        "npm run dev            # runs on http://localhost:5174",
        "",
        "# 5. Run frontend tests",
        "cd frontend && npm test",
    ]
    for cmd in commands:
        pdf.cell(0, 5, cmd, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    pdf.set_font("Helvetica", "", 10)
    pdf.body_text(
        "In production, run 'npm run build' in both the frontend and admin directories. "
        "The output dist/ folders can be served as static files by Nginx or any static hosting "
        "provider (Vercel, Netlify). The backend can be deployed to any Node.js host "
        "(Railway, Render, DigitalOcean App Platform, AWS EC2, etc.)."
    )

    pdf.sub_title("16.3 Key Features Summary")
    pdf.sub_title("  Customer Features")
    pdf.bullet("Browse and filter food items by category with animated transitions")
    pdf.bullet("Full-text search across food name, description, and category")
    pdf.bullet("Shopping cart with real-time quantity management (backend-synced for auth users)")
    pdf.bullet("Secure checkout via Stripe payment gateway (+ $2 delivery fee)")
    pdf.bullet("Order history with real-time status tracking")
    pdf.bullet("Registration / login with JWT; social login via Google and Facebook")
    pdf.bullet("Responsive design with Framer Motion page transitions")
    pdf.bullet("Toast notifications for all user-facing actions")

    pdf.ln(2)
    pdf.sub_title("  Admin Features")
    pdf.bullet("Analytics dashboard: total orders, revenue, status breakdown by period")
    pdf.bullet("Add food items with image upload preview and form validation")
    pdf.bullet("View, edit, and remove food items from the live catalogue")
    pdf.bullet("Manage all orders; update statuses with inline dropdown controls")
    pdf.bullet("Time-period order filtering (Today / Week / Month / Year / All Time)")
    pdf.bullet("Automatic customer email notification on every status change")

    pdf.ln(2)
    pdf.sub_title("  Technical Highlights")
    pdf.bullet("Full OOP architecture using ES6 classes across all three applications")
    pdf.bullet("10 design patterns: Singleton, Repository, Strategy, Factory, Observer, "
               "Adapter, Dependency Injection, MVC, Context, Service Layer")
    pdf.bullet("API rate limiting, JWT authentication, bcrypt password hashing")
    pdf.bullet("Mongoose ODM with schema validation and full-text search indexing")
    pdf.bullet("Multer file upload middleware; static file serving for food images")
    pdf.bullet("10 frontend unit tests with Vitest + React Testing Library")

    # ── Save ─────────────────────────────────────────────────────
    import os
    output_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "Food_Delivery_Project_Report.pdf"
    )
    pdf.output(output_path)
    print(f"Report generated: {output_path}")


if __name__ == "__main__":
    build_report()
