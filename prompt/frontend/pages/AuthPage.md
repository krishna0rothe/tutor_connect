### **Base Prompt for Signup Page**

**Design a signup page** for an educational app with three distinct sections (Teacher, Student, Parent). Each role will have unique input fields based on its requirements. Ensure the layout is visually organized, responsive, and intuitive, and aligns with the following guidelines:

#### **Color Combination and UI Design:**
1. **Header and Navigation:**  
   - Sticky header with the app logo on the left and a simple navigation menu (e.g., Login, Home).  
   - Gradient background (blue-to-teal) for the header.  

2. **Tabs for User Roles:**  
   - Use a segmented control or tab-like UI for switching between roles (e.g., **Teacher**, **Parent**, **Student**).  
   - Highlight the active tab with an accent color (yellow/orange).  

3. **Form Container:**  
   - Card-style container with subtle shadow and rounded edges.  
   - Background: White.  
   - Submit button: Prominent (blue with hover effect to teal).  

4. **Typography:**  
   - Headers: Bold, 24px for form title.  
   - Input labels: Regular, 16px for readability.  

5. **Animations:**  
   - Smooth transitions between role forms.  
   - Highlighting active input fields with a glowing border effect.  

---

### **Components of Signup Page**

#### **Role Selection Tabs:**
- Teacher | Parent | Student  
- Dynamic switching between forms based on the selected role.  

#### **Input Fields (Role-Specific):**
1. **Student Signup Form:**  
   - Name (Text field).  
   - Email (Email field).  
   - Password (Password field).  
   - Mobile (Number field).  

2. **Parent Signup Form:**  
   - Name (Text field).  
   - Email (Email field).  
   - Password (Password field).  
   - Mobile (Number field).  

3. **Teacher Signup Form:**  
   - Name (Text field).  
   - Email (Email field).  
   - Password (Password field).  
   - Mobile (Number field).  
   - Specialization (Drop-down menu).  
   - Qualification (Drop-down menu).  

#### **Submit Button:**  
- CTA: *"Sign Up"*  
- Button hover effect: Color change from blue to teal with slight shadow lift.  

#### **Route:**  
- API Route for signup: `/signup`  

---

### **Base Prompt for Login Page**

**Design a login page** for the educational app that is common for all roles. Focus on simplicity, accessibility, and security. The page should contain:  

#### **UI Design Principles:**
1. **Header:**  
   - Similar header as the signup page for consistency.  

2. **Form Container:**  
   - Centered, card-style container with a blue gradient outline for emphasis.  
   - Background: White.  

3. **Input Fields:**  
   - Email (Email field).  
   - Password (Password field).  

4. **Buttons and Links:**  
   - Login button: Prominent (blue-to-teal gradient with hover animation).  
   - Link to Signup: *"Don't have an account? Sign Up."*  

5. **Typography:**  
   - Headers: Bold, 24px.  
   - Labels: 16px for clarity.  

6. **Animations:**  
   - Loading animation on the login button.  
   - Smooth fade-in for error messages.  

---

#### **Components of Login Page**
1. **Input Fields:**  
   - Email (Email field).  
   - Password (Password field).  

2. **Remember Me Checkbox:**  
   - Option for users to stay logged in.  

3. **Forgot Password Link:**  
   - Directs users to the password recovery page.  

4. **Submit Button:**  
   - CTA: *"Log In"*  
   - Animated loader upon submission.  

#### **Route:**  
- API Route for login: `/login`  

---

### **Extra Features for Both Pages**
1. **Responsive Design:**  
   - Adapt to desktop, tablet, and mobile screens.  
2. **Accessibility:**  
   - High-contrast mode toggle for visually impaired users.  
3. **Validation:**  
   - Real-time input validation (e.g., email format, password strength).  

