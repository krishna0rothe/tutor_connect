### Prompt to Create Dashboards for Student, Teacher, and Parent Roles  

**Objective:** Build **three distinct dashboards** (Teacher, Student, Parent) for an educational website, with individual components for each role. The dashboards should reuse shared components like the slide bar and slide bar items for consistency and maintain a modular structure. Align this prompt with the styling guidelines provided in your existing prompt to ensure cohesive UI/UX design.  

---

### **Structure of the Dashboard Component**

#### **Shared Components:**  
1. **Slide Bar Component:**  
   - A vertical slide bar located on the left side of the dashboard.  
   - Contains navigation options specific to the role (e.g., *My Students*, *Find Tutor*).  
   - Reusable for all roles, with options dynamically rendered based on the user’s role.  

2. **Slide Bar Item Component:**  
   - Individual items within the slide bar for navigation.  
   - Includes: Icon + Label (e.g., 📅 *Upcoming Events*).  
   - Features hover effects and an active state for the selected item.  

3. **Main Content Area:**  
   - Displays content based on the selected service from the slide bar.  
   - Dynamically switches between service-specific components (e.g., *Progress Report*, *Find Tutor*).  

---

### **Role-Specific Components and Features**

#### **Teacher Dashboard Component:**  
- **Features:**  
  - *My Students*: A table or card layout listing students with basic details (name, progress, contact info).  
  - *Progress Report*: A dynamic chart showing student performance and analytics.  
  - *Upcoming Events and Schedule*: Calendar view with events and schedule details.  
- **Route:** `/dashboard/teacher`  

#### **Student Dashboard Component:**  
- **Features:**  
  - *Find Tutor*: Search bar with filters (subject, rating, availability).  
  - *My Courses*: A list of enrolled courses with progress indicators.  
  - *Saved Tutor*: A collection of bookmarked tutors with quick actions (e.g., Message, Book Session).  
  - *Upcoming Sessions*: Calendar view for upcoming tutor sessions.  
- **Route:** `/dashboard/student`  

#### **Parent Dashboard Component:**  
- **Features:**  
  - *Student Progress*: Charts and tables showing the performance of their child.  
  - *Message Tutor*: A messaging interface to communicate with tutors.  
  - *Upcoming Events*: List of events relevant to the child’s education.  
- **Route:** `/dashboard/parent`  

---

### **Styling Considerations**
1. **Slide Bar Styling:**  
   - Fixed height and width with a subtle shadow.  
   - Background: Blue gradient transitioning to white.  
   - Hover effect: Slight scaling and color change of icons.  

2. **Active Slide Bar Item:**  
   - Highlight with a teal background and bold font style.  

3. **Main Content Area:**  
   - White background with subtle padding for a clean look.  
   - Use responsive grids for displaying lists, charts, or cards.  

---

### **Component Structure and Workflow**
1. Create **Dashboard Wrapper Component**:  
   - Contains the slide bar and main content area.  
   - Dynamically renders the respective dashboard (Teacher, Student, Parent) based on the logged-in role.  

2. Create **Reusable Slide Bar Component**:  
   - Accepts a list of items (icon + label) as props to render navigation options dynamically.  

3. Create **Role-Specific Components**:  
   - Build individual components for each feature (e.g., *My Courses*, *Find Tutor*).  
   - Dynamically load these components in the main content area.  

4. Add **Routing Logic**:  
   - Use role-based routes to render the correct dashboard component.  

---

### Example Prompt for Implementation  
**Teacher Dashboard Example:**  
"Create a responsive Teacher Dashboard component with a reusable slide bar. The slide bar should contain options for *My Students*, *Progress Report*, and *Upcoming Events and Schedule*. On selecting a slide bar item, dynamically load the corresponding content into the main content area. The slide bar should have hover and active state animations. Align the design with the provided color and typography guidelines."  

**Student Dashboard Example:**  
"Design a modular Student Dashboard with a shared slide bar and features like *Find Tutor*, *My Courses*, *Saved Tutor*, and *Upcoming Sessions*. Use cards and grids to display content in the main area. Ensure smooth transitions and animations between sections."  

**Parent Dashboard Example:**  
"Build a Parent Dashboard with features like *Student Progress*, *Message Tutor*, and *Upcoming Events*. Use a shared slide bar for navigation. Display the *Student Progress* data in charts and tables for better visualization. Follow consistent styling and animations."  

---

### Additional Notes  
- Ensure all dashboards are fully responsive and accessible.  
- Optimize the slide bar for smaller screens with a collapsible design.  
- Reuse shared components to maintain consistency and reduce development overhead.  

This prompt ensures a modular and scalable dashboard structure tailored to your application needs.