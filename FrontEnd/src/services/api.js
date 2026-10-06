const BASE_URL = "http://127.0.0.1:8000/students"

export const getStudents = async () => {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error(
            `Failed to retrieve students: ${response.status}`
        );
    }

    return await response.json();
};

export const deleteStudent = async (studentId) => {

    // Send a DELETE request to the FastAPI endpoint
    // using the Student ID provided by the user.
    const response = await fetch(
        `http://127.0.0.1:8000/students/${studentId}`,
        {
            method: "DELETE"
        }
    );

    // Convert the JSON response from FastAPI into
    // a JavaScript object.
    const data = await response.json();

    // Check if the API returned an unsuccessful HTTP response.
    // Examples: 404 Not Found or 500 Internal Server Error.
    if (!response.ok) {

        // FastAPI returns error messages in the "detail" property.
        // Throwing the error allows the React component's
        // try/catch block to handle and display the message.
        throw new Error(
            data.detail || "Unable to delete student."
        );
    }

    // Return the successful response from FastAPI.
    return data;
};


/**
 * createStudent
 *
 * Sends a POST request to the FastAPI backend to create
 * a new student.
 *
 * The student object is converted to JSON and sent in the
 * request body. FastAPI validates the data using the
 * StudentCreate Pydantic schema.
 *
 * If the request is successful, the newly created student
 * object is returned.
 *
 * If FastAPI returns an error, such as a validation error
 * (422) or duplicate email (409), an error is thrown so the
 * React component can handle it with try/catch.
 *
 * @param {Object} student - Student information entered in the form.
 * @returns {Object} The newly created student returned by FastAPI.
 */
export const createStudent = async (student) => {

    // Send a POST request to the FastAPI students endpoint.
    const response = await fetch(
        "http://127.0.0.1:8000/students",
        {
            // POST is used to create a new resource.
            method: "POST",

            // Tell FastAPI that the request body contains JSON data.
            headers: {
                "Content-Type": "application/json"
            },

            // Convert the JavaScript student object into a JSON string
            // before sending it to the FastAPI backend.
            body: JSON.stringify(student)
        }
    );

    // Convert the JSON response from FastAPI into
    // a JavaScript object.
    const data = await response.json();

    // Display the FastAPI response in the browser console.
    // Useful for debugging API responses and validation errors.
    console.log("FastAPI response:", data);

    // Check whether FastAPI returned an unsuccessful HTTP status.
    // response.ok is false for responses such as:
    // 409 Conflict, 422 Unprocessable Content, or 500 Server Error.
    if (!response.ok) {

        // FastAPI stores validation and HTTP exception information
        // inside the "detail" property.
        //
        // JSON.stringify() converts the detail object/array into
        // a string so it can be passed to JavaScript's Error object.
        throw new Error(
            JSON.stringify(data.detail)
        );
    }

    // Return the newly created student object to the
    // React component that called createStudent().
    return data;
};



/**
 * getStudent
 *
 * Retrieves a single student from the FastAPI backend
 * using the student's unique Student ID.
 *
 * If the student exists, the student object is returned.
 * If the student does not exist, an error is thrown so
 * the React component can handle it with try/catch.
 *
 * @param {string} studentId - The unique Student ID.
 * @returns {Object} The student returned by FastAPI.
 */
export const getStudent = async (studentId) => {

    // Send a GET request to FastAPI using the Student ID.
    const response = await fetch(
        `http://127.0.0.1:8000/students/${studentId}`,
        {
            method: "GET"
        }
    );

    // Convert the JSON response from FastAPI into
    // a JavaScript object.
    const data = await response.json();

    // Check whether FastAPI returned an unsuccessful response.
    if (!response.ok) {

        // FastAPI returns HTTPException messages in
        // the "detail" property.
        throw new Error(
            data.detail || "Unable to find student."
        );
    }

    // Return the student object returned by FastAPI.
    return data;
};


/**
 * deactivateStudent
 *
 * Changes a student's active status to false.
 *
 * @param {string} studentId - The unique Student ID.
 * @returns {Object} The updated student.
 */
export const deactivateStudent = async (studentId) => {

    const response = await fetch(
        `http://127.0.0.1:8000/students/${studentId}/status`,
        {
            method: "PATCH"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Unable to deactivate student."
        );
    }

    return data;
};

export const updateStudent = async (studentId, student) => {

    // Send a PATCH request to FastAPI using the Student ID.
    const response = await fetch(
        `http://127.0.0.1:8000/students/${studentId}`,
        {
            method: "PATCH",

            // Tell FastAPI that the request body contains JSON.
            headers: {
                "Content-Type": "application/json"
            },

            // Convert the student object into JSON and
            // send it in the request body.
            body: JSON.stringify(student)
        }
    );

    // Convert the JSON response from FastAPI
    // into a JavaScript object.
    const data = await response.json();

    // Check whether the update was unsuccessful.
    if (!response.ok) {
        throw new Error(
            data.detail || "Unable to update student."
        );
    }

    // Return the updated student from FastAPI.
    return data;
};

 