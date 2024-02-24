import { useEffect, useState } from "react";

function downloadTerraformFile(terraformCode: string) {
  // Create a Blob object with Terraform code and the specific type
  const blob = new Blob([terraformCode], { type: "text/plain" });

  // Generate a temporary URL for the Blob object
  const url = URL.createObjectURL(blob);

  return url;
}

export default function TerraformConfigPage() {
  const [terraformURL, setTerraformURL] = useState("");

  useEffect(() => {
    const hackedDiagramData = sessionStorage.getItem("graph");

    if (!hackedDiagramData) {
      alert("No diagram data found");
    }

    // TODO: Fix this
    const jsonBody = JSON.parse(hackedDiagramData!);

    console.log(jsonBody);

    fetch("/api/terraform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ services: jsonBody }),
    })
      .then((response) => response.json())
      .then((data) =>
        setTerraformURL(downloadTerraformFile(data.terraformConfig))
      );
  }, []);

  return (
    <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
      <h1 className="text-6xl font-bold">
        Welcome to{" "}
        <a className="text-blue-600" href="#">
          Stratus
        </a>
      </h1>

      <a href={terraformURL} download="main.tf">
        Download Terraform file
      </a>
    </main>
  );
}
