import { Btn } from "@/components/nova/ui";

export default function NotFound() {
  return (
    <div className="notfound container">
      <span className="eyebrow">404 / PAGINA NIET GEVONDEN</span>
      <h1>Oeps.</h1>
      <p>
        Deze pagina bestaat niet (meer). Misschien is de link veranderd. Via de
        homepage vind je snel weer je weg.
      </p>
      <div style={{ marginTop: 30 }}>
        <Btn to="" cl="btn-dark">
          Terug naar de homepage
        </Btn>
      </div>
    </div>
  );
}
