import { useEffect, useState } from 'react';

export default function TerraformConfigPage() {
  const [terraformConfig, setTerraformConfig] = useState('');

  useEffect(() => {
    fetch('/api/test')
      .then(response => response.json())
      .then(data => setTerraformConfig(data.terraformConfig));
  }, []);

  return (
    <div>
      <pre>{terraformConfig}</pre>
    </div>
  );
}