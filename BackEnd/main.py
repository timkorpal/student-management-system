from fastapi import FastAPI, status, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import get_db, Base, engine
from models import Student
from schemas import StudentCreate, StudentResponse, StudentUpdate
from fastapi.middleware.cors import CORSMiddleware

# Create all database tables defined by SQLAlchemy models.
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.patch(
    "/students/{student_id}",
    response_model=StudentResponse
)
async def update_student(
    student_id: str,
    student_update: StudentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update one or more fields for an existing student.

    Only fields included in the PATCH request are updated.
    """

    # Find the student using their unique Student ID.
    statement = select(Student).where(
        Student.student_id == student_id
    )

    # Execute the SELECT statement.
    result = db.execute(statement)

    # Retrieve the matching Student object.
    student = result.scalar_one_or_none()

    # Return 404 if the student does not exist.
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student ID {student_id} not found."
        )

    # Get only the fields that were included
    # in the PATCH request.
    update_data = student_update.model_dump(
        exclude_unset=True
    )

    # Update each field on the SQLAlchemy Student object.
    for field, value in update_data.items():
        setattr(student, field, value)

    # Save the changes to PostgreSQL.
    db.commit()

    # Reload the student from the database.
    # This also retrieves the new updated_at value.
    db.refresh(student)

    # Return the complete updated student.
    return student


@app.patch(
    "/students/{student_id}/status",
    response_model=StudentResponse
)
async def update_student_status(
    student_id: str,
    db: Session = Depends(get_db)
):
    """
    Deactivate a student using their unique Student ID.

    The student's status is changed from True to False.
    """

    # Find the student using their Student ID.
    statement = select(Student).where(
        Student.student_id == student_id
    )

    result = db.execute(statement)

    student = result.scalar_one_or_none()

    # Return 404 if the student does not exist.
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student ID {student_id} not found."
        )

    # Change the student's active status to False.
    student.status = False

    # Save the change to PostgreSQL.
    db.commit()

    # Reload the student with the updated database values.
    db.refresh(student)

    return student


@app.delete(
    "/students/{student_id}",
    status_code=status.HTTP_200_OK
)
async def delete_student(
    student_id: str,
    db: Session = Depends(get_db)
):
    """
    Delete a student using their unique Student ID.

    The Student ID is received as a path parameter from the URL.
    The database is searched for a matching student record.

    If the student exists, the record is deleted from PostgreSQL.
    If the student does not exist, a 404 Not Found response is returned.
    """

    # Create a SQLAlchemy SELECT statement to find the student
    # whose student_id matches the ID provided in the URL.
    statement = select(Student).where(
        Student.student_id == student_id
    )

    # Execute the SELECT statement against the database.
    result = db.execute(statement)

    # Retrieve the matching Student object.
    # Returns None if no student with the provided ID exists.
    student = result.scalar_one_or_none()

    # Check whether the student was found.
    # If not, return a 404 Not Found response to the client.
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student ID {student_id} not found."
        )

    # Mark the student record for deletion.
    # The deletion is not permanently saved until commit() is called.
    db.delete(student)

    # Commit the transaction to permanently delete the student
    # record from the PostgreSQL database.
    db.commit()

    # Return confirmation to the React frontend.
    return {
        "message": f"Student ID {student_id} deleted successfully."
    }



    

@app.get(
    "/students",
    status_code=status.HTTP_200_OK,
    response_model=list[StudentResponse]
)
async def get_students(
    db: Session = Depends(get_db)
):
    """
    Retrieve all students from the PostgreSQL database.
    """

    # Create a SELECT query for the students table.
    statement = select(Student)

    # Execute the query.
    result = db.execute(statement)

    # Convert the result into a list of Student objects.
    students = result.scalars().all()

    return students


@app.post(
    "/students",
    status_code=status.HTTP_201_CREATED,
    response_model=StudentResponse
)
async def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    """
    Creates a new student and generates a unique five-digit student ID.
    """

    new_student = Student(
        first_name=student.first_name,
        last_name=student.last_name,
        email=student.email,
        phone=student.phone,
        major=student.major,
        status=student.status,
        enrollment_date=student.enrollment_date,
    )

    # Add the new student to the database session.
    db.add(new_student)

    # Send the INSERT to PostgreSQL.
    # PostgreSQL generates the primary key.
    db.flush()

    # Generate the five-digit student ID using the
    # PostgreSQL-generated primary key.
    new_student.student_id = f"{new_student.id:05d}"

    # Commit the completed student record.
    db.commit()

    # Reload database-generated values such as timestamps.
    db.refresh(new_student)

    return new_student


@app.get(
    "/students/{student_id}",
    response_model=StudentResponse
)
async def get_student(
    student_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve a single student using their unique Student ID.

    If the student exists, the student record is returned.
    If the student does not exist, a 404 Not Found response
    is returned.
    """

    # Create a SELECT statement that searches for a student
    # whose student_id matches the ID provided in the URL.
    statement = select(Student).where(
        Student.student_id == student_id
    )

    # Execute the SELECT statement against the database.
    result = db.execute(statement)

    # Retrieve the matching Student object.
    # Returns None if no matching student exists.
    student = result.scalar_one_or_none()

    # Check whether the student was found.
    # If not, return a 404 Not Found response.
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student ID {student_id} not found."
        )

    # Return the Student object.
    # FastAPI converts it into the StudentResponse schema.
    return student