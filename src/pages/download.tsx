import { useEffect, useState } from "react";
import Image from "next/image";

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
    <>
      <div className="flex justify-center">
        <h1 className="font-custom text-white mt-36 mb-16 text-5xl">
          Deploy your Architecture
        </h1>
      </div>
      <main className="flex items-center font-customlight justify-center mt-4">
        <div className="grid text-white grid-cols-2 p-4">
          <div>
            <h2 className="text-3xl font-bold mb-4">Step 1:</h2>
            <a href={terraformURL} download="main.tf">
              <Image
                src="/images/downloadbtn.png"
                alt="Download"
                width={400}
                height={400}
              />
            </a>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Step 2. Set up AWS</h2>
              <ul className="list-disc list-inside">
                <li className="mt-2">
                  <a
                    href="https://portal.aws.amazon.com/billing/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-spurple"
                  >
                    Create AWS account
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-spurple"
                  >
                    Install AWS CLI
                  </a>
                </li>
                <li>
                  Run{" "}
                  <code className="text-spurple bg-blockgrey p-1">
                    aws configure sso
                  </code>{" "}
                  to login
                </li>
              </ul>
            </div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Step 3. Set up Terraform</h2>
              <ul className="list-disc list-inside">
                <li className="mt-2">
                  <a
                    href="https://learn.hashicorp.com/tutorials/terraform/install-cli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-spurple"
                  >
                    Install Terraform CLI
                  </a>
                </li>
                <li>Download Terraform file (Step 1)</li>
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold">
                Step 4. Apply Terraform Configuration
              </h2>
              <ul className="list-disc list-inside">
                <li className="mt-2">
                  Run{" "}
                  <code className="text-spurple bg-blockgrey p-1">
                    terraform init
                  </code>{" "}
                  (with tf file in root directory)
                </li>
                <li>
                  Run{" "}
                  <code className="text-spurple bg-blockgrey p-1">
                    terraform apply
                  </code>{" "}
                  (with tf file in root directory)
                </li>
                <li>
                  For Route53 - Link your domain to your hosted zone using the
                  name server
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
