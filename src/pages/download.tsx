import { useEffect, useState } from 'react';

function downloadTerraformFile(terraformCode:string) {
    // Create a Blob object with Terraform code and the specific type
    const blob = new Blob([terraformCode], { type: 'text/plain' });
  
    // Generate a temporary URL for the Blob object
    const url = URL.createObjectURL(blob);
  
    return url;
  }

export default function TerraformConfigPage() {
  const [terraformURL, setTerraformURL] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then(response => response.json())
      .then(data => setTerraformURL(downloadTerraformFile(data.terraformConfig)));
  }, []);

  return (
    <div>
        <a href={terraformURL} download="main.tf">Download Terraform file</a>
    </div>
  );
}