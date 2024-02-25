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
    const graphServices = sessionStorage.getItem("graphServices");
    const graphEdges = sessionStorage.getItem("graphEdges");

    if (!graphServices) {
      alert("No graphServices found from sessionStorage");
    }

    const payload = {
      graphServices: JSON.parse(graphServices!),
      graphEdges: JSON.parse(graphEdges!).map((e: any) => ({
        source: e.source,
        target: e.target,
      })),
    };

    console.log(payload);

    fetch("/api/terraform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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

      <a href={terraformURL} download="main.tf" className="text-white">
        Download Terraform file
      </a>
    </main>
  );
}
