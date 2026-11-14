import { Btn } from "@/components/nova/ui";

export default function NotFound() {
  return (
    <div className="notfound container">
      <span className="eyebrow">404 / PAGINA NIET GEVONDEN</span>
      <h1>Oops.</h1>
      <p>Ook in het visuele ontwerp kan een pagina ontbreken.</p>
      <div style={{ marginTop: 30 }}>
        <Btn to="" cl="btn-dark">
          Terug naar NOVA
        </Btn>
      </div>
    </div>
  );
}
