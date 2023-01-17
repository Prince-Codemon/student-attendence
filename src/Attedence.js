import { useState, useEffect } from "react";

const Attendance = () => {
  // State variables to store the input fields
  const data = JSON.parse(localStorage.getItem("students")) || [];

  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [students, setStudents] = useState(data);
  const [error, setError] = useState("");
  const [present, setPresent] = useState();
  const getTime = () => {
    const date = new Date();
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return time;
  };

  const checkIn = () => {
    if (rollNumber === "" || name === "") {
      setError("Please enter roll number and name");
    } else if (students.find((student) => student.rollNumber === rollNumber)) {
      setError("Student already checked in");
    } else {
      setError("");
      setStudents([
        ...students,
        { rollNumber, name, checkin: getTime(), checkout: null },
      ]);
      setRollNumber("");
      setName("");
    }
  };
  const checkOut = (roll) => {
    const student = students.find((student) => student.rollNumber === roll);
   
    student.checkout = getTime();
   
    setStudents([...students]);
    localStorage.setItem("students", JSON.stringify(students));
  };
  const clearRecords = () => {
    setStudents([]);
    localStorage.setItem("students", JSON.stringify([]));
  };

  useEffect(() => {
    let count = 0;
    students.forEach((student) => {
      if (student.checkout === null) {
        count++;
      }
    });
    setPresent(count);
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  return (
    <div className="container">
      <h1>Student Attendance</h1>
      <div className="form">
        <input
          type="number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          placeholder="Enter Roll Number"
        />

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
        />

        <button onClick={checkIn}>Check In</button>
      </div>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <div className="students">
        <h2>Students</h2>

        {students.length < 1 ? (
          <p>No data </p>
        ) : (
          <>
            <p>Present Students :{present} </p>
            <p>Total Students :{students.length} </p>
            <button onClick={clearRecords}>Clear Records</button>
            <table>
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.rollNumber}>
                    <td>{student.rollNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.checkin}</td>
                    <td>
                      {student.checkout === null ? (
                        <button onClick={() => checkOut(student.rollNumber)}>
                          {" "}
                          Check Out
                        </button>
                      ) : (
                        student.checkout
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;
