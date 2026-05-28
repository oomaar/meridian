export function ImportRosterNote() {
  return (
    <p className="m-import-note">
      Required columns:{" "}
      <code>First Name, Last Name, Email, Program, Standing</code>
      <br />
      Optional: <code>Student ID, Status, GPA, Credits</code>
    </p>
  );
}
