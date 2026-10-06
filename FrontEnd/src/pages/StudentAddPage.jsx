import { useState } from "react";
import "../css/StudentAddPage.css";
import { createStudent } from "../services/api";


/**
 * StudentAddPage
 *
 * Displays a form that allows the user to create a new student.
 *
 * The form collects:
 * - First name
 * - Last name
 * - Email address
 * - Phone number
 * - Major
 * - Enrollment date
 *
 * React useState is used to store the form data. The input fields
 * are controlled components, meaning their values are connected
 * directly to the student state.
 *
 * When the form is submitted:
 * 1. The email address is validated.
 * 2. The phone number is validated.
 * 3. The student data is sent to the FastAPI backend.
 * 4. FastAPI creates the student in PostgreSQL.
 * 5. The newly created student information is displayed.
 * 6. The form is cleared after a successful submission.
 */
function StudentAddPage() {

    // ---------------------------------------------------------
    // Student State
    // ---------------------------------------------------------

    // Store all student form values in a single state object.
    //
    // Each form input uses its corresponding property from
    // this object as its value.
    const [student, setStudent] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        major: "",
        status: true,
        enrollment_date: "",
    });


    // ---------------------------------------------------------
    // Handle Form Submission
    // ---------------------------------------------------------

    /**
     * Handles the Add Student form submission.
     *
     * Validates the student information before sending it
     * to the FastAPI backend.
     *
     * @param {Event} event - The form submission event.
     */
    const handleSubmit = async (event) => {

        // Prevent the browser's default form submission behavior,
        // which would refresh the page.
        event.preventDefault();


        // ---------------------------------------------------------
        // Validate Email
        // ---------------------------------------------------------

        // Regular expression used to perform basic email validation.
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Stop the form submission if the email format is invalid.
        if (!emailPattern.test(student.email)) {

            alert("Please enter a valid email address.");

            return;
        }


        // ---------------------------------------------------------
        // Validate Phone Number
        // ---------------------------------------------------------

        // Remove all non-numeric characters from the phone number.
        //
        // Example:
        // 480-555-1234 → 4805551234
        const phoneDigits =
            student.phone.replace(/\D/g, "");

        // Verify that the phone number contains exactly 10 digits.
        if (phoneDigits.length !== 10) {

            alert("Phone number must contain 10 digits.");

            return;
        }


        // ---------------------------------------------------------
        // Create Student
        // ---------------------------------------------------------

        try {

            // Send the student object to the createStudent()
            // API function.
            //
            // createStudent() sends a POST request to:
            // POST /students
            const data = await createStudent(student);

            // Display the newly created student in the
            // browser console for debugging.
            console.log("Student created:", data);


            // ---------------------------------------------------------
            // Display Success Message
            // ---------------------------------------------------------

            // Display information returned by FastAPI after the
            // student is successfully created.
            alert(
                `Student created successfully!

                Student ID: ${data.student_id}
                Name: ${data.first_name} ${data.last_name}
                Email: ${data.email}
                Phone: ${data.phone}
                Major: ${data.major}
                Enrollment Date: ${data.enrollment_date}`
            );


            // ---------------------------------------------------------
            // Reset Form
            // ---------------------------------------------------------

            // Clear the student state after the API successfully
            // creates the student.
            //
            // Because each form input is a controlled component,
            // changing the state back to empty values automatically
            // clears the form fields on the screen.
            setStudent({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                major: "",
                status: true,
                enrollment_date: "",
            });

        } catch (error) {

            // ---------------------------------------------------------
            // Handle API Errors
            // ---------------------------------------------------------

            // Display the error in the browser console.
            //
            // Examples include:
            // - 409 Conflict for duplicate email
            // - 422 validation errors
            // - Server/database errors
            console.error(
                "Unable to create student:",
                error
            );

            // Display the API error message to the user.
            alert(
                `Unable to create student: ${error.message}`
            );
        }
    };


    // ---------------------------------------------------------
    // Handle Input Changes
    // ---------------------------------------------------------

    /**
     * Handles changes to all form inputs.
     *
     * The name attribute of the input determines which property
     * in the student state object should be updated.
     *
     * The phone field receives additional formatting so that
     * phone numbers are displayed as XXX-XXX-XXXX.
     *
     * @param {Event} event - The input change event.
     */
    const handleChange = (event) => {

        // Extract the input's name and current value.
        const { name, value } = event.target;

        // By default, use the value exactly as entered.
        let newValue = value;


        // ---------------------------------------------------------
        // Format Phone Number
        // ---------------------------------------------------------

        if (name === "phone") {

            // Remove anything that is not a number.
            //
            // Example:
            // "480-55a" → "48055"
            const numbers =
                value.replace(/\D/g, "");

            // Limit the phone number to a maximum of 10 digits.
            const limitedNumbers =
                numbers.slice(0, 10);


            // Format based on how many digits the user
            // has entered.

            // Example:
            // 480
            if (limitedNumbers.length <= 3) {

                newValue = limitedNumbers;

            // Example:
            // 480-555
            } else if (limitedNumbers.length <= 6) {

                newValue =
                    `${limitedNumbers.slice(0, 3)}-` +
                    `${limitedNumbers.slice(3)}`;

            // Example:
            // 480-555-1234
            } else {

                newValue =
                    `${limitedNumbers.slice(0, 3)}-` +
                    `${limitedNumbers.slice(3, 6)}-` +
                    `${limitedNumbers.slice(6)}`;
            }
        }


        // ---------------------------------------------------------
        // Update Student State
        // ---------------------------------------------------------

        // Copy the existing student object and update only
        // the property matching the input's name.
        //
        // Example:
        //
        // name = "first_name"
        // value = "John"
        //
        // becomes:
        //
        // student.first_name = "John"
        setStudent({
            ...student,
            [name]: newValue
        });
    };


    // ---------------------------------------------------------
    // Page Layout
    // ---------------------------------------------------------

    return (
        <div className="add-student">

            {/* Page title */}
            <h2>Add Student</h2>


            {/* 
                Submit the form using handleSubmit().
                React prevents the normal browser form submission
                and handles the request through JavaScript.
            */}
            <form onSubmit={handleSubmit}>


                {/* ------------------------------------------------
                    First Name
                   ------------------------------------------------ */}

                <div className="form-group">

                    <label htmlFor="first_name">
                        First Name:
                    </label>

                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={student.first_name}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* ------------------------------------------------
                    Last Name
                   ------------------------------------------------ */}

                <div className="form-group">

                    <label htmlFor="last_name">
                        Last Name:
                    </label>

                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={student.last_name}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* ------------------------------------------------
                    Email
                   ------------------------------------------------ */}

                <div className="form-group">

                    <label htmlFor="email">
                        Email:
                    </label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={student.email}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* ------------------------------------------------
                    Phone
                   ------------------------------------------------ */}

                <div className="form-group">

                    <label htmlFor="phone">
                        Phone:
                    </label>

                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={student.phone}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* ------------------------------------------------
                    Major
                   ------------------------------------------------ */}

                <div className="form-group">

                    <label htmlFor="major">
                        Major:
                    </label>

                    <select
                        id="major"
                        name="major"
                        value={student.major}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Select a Major
                        </option>

                        <option value="Computer Science">
                            Computer Science
                        </option>

                        <option value="Information Technology">
                            Information Technology
                        </option>

                        <option value="Business">
                            Business
                        </option>

                        <option value="Engineering">
                            Engineering
                        </option>

                        <option value="Mathematics">
                            Mathematics
                        </option>
                    </select>

                </div>


                {/* ------------------------------------------------
                    Enrollment Date
                   ------------------------------------------------ */}

                <div className="form-group">

                    <label htmlFor="enrollment_date">
                        Enrollment Date:
                    </label>

                    <input
                        type="date"
                        id="enrollment_date"
                        name="enrollment_date"
                        value={student.enrollment_date}
                        onChange={handleChange}
                        required
                    />

                </div>


                {/* Submit the completed student form */}
                <button
                    className="add-student-button"
                    type="submit"
                >
                    Add Student
                </button>

            </form>

        </div>
    );
}


export default StudentAddPage;