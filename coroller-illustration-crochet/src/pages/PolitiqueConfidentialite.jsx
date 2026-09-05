import React from "react";
import { C } from "../App";

export default function PolitiqueConfidentialite({ dark }) {
    const txt = dark ? "#f0eef8" : "#0d0b1a";
    const muted = dark ? "#8b8aaa" : "#6a6880";

    return (
        <div style={{ 
            paddingTop: "140px", 
            paddingBottom: "100px",
            minHeight: "100vh", 
            maxWidth: "100vw",
            background: dark ? C.ink : "#faf8f4",
            color: txt,
            paddingLeft: "20px",
            paddingRight: "20px",
            fontFamily: "Corbel, sans-serif",
            transition: "all .5s"
        }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "40px" }}>
                    Politique de Confidentialité (RGPD)
                </h1>

                <p style={{ color: muted, lineHeight: "1.6", marginBottom: "32px" }}>
                    <em>Dernière mise à jour : Mai 2026</em><br /><br />
                    La protection de vos données personnelles est essentielle. Cette politique vous explique de manière transparente comment sont traitées les informations que vous transmettez via ce site.
                </p>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>1. Données collectées</h2>
                    <p style={{ color: muted, lineHeight: "1.6" }}>
                        Lorsque vous utilisez le formulaire de contact, les seules données collectées sont celles que vous saisissez volontairement : vos <strong>nom, prénom, adresse e-mail</strong> et le <strong>contenu de votre message</strong>.
                    </p>
                </section>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>2. Utilisation des données</h2>
                    <p style={{ color: muted, lineHeight: "1.6" }}>
                        Ces données servent uniquement à :
                    </p>
                    <ul style={{ color: muted, lineHeight: "1.6", paddingLeft: "20px" }}>
                        <li>Répondre à vos demandes de renseignements ou devis.</li>
                        <li>Échanger avec vous dans le cadre de vos projets d'illustration ou de crochet.</li>
                    </ul>
                    <p style={{ color: muted, lineHeight: "1.6", marginTop: "12px" }}>
                        Elles ne seront <em>jamais</em> cédées, vendues, louées ou partagées avec des tiers à des fins commerciales.
                    </p>
                </section>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>3. Stockage et Sécurité</h2>
                    <p style={{ color: muted, lineHeight: "1.6" }}>
                        Le site utilise le service sécurisé <strong>EmailJS</strong> pour acheminer vos messages. Vos informations ne sont pas stockées dans une base de données sur ce site, elles arrivent directement sous forme d'e-mail sécurisé dans la boîte de réception de Marie Coroller.
                    </p>
                </section>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>4. Durée de conservation</h2>
                    <p style={{ color: muted, lineHeight: "1.6" }}>
                        Vos données de contact sont conservées pendant la durée nécessaire au traitement de votre demande ou pour le suivi de notre relation professionnelle, dans la limite de 3 ans après notre dernier échange.
                    </p>
                </section>

                <section style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>5. Vos droits</h2>
                    <p style={{ color: muted, lineHeight: "1.6" }}>
                        Conformément au RGPD, vous disposez d’un droit d’accès, de modification, de rectification et de suppression de vos données. Pour exercer ce droit, il vous suffit d'envoyer un message via la page de contact du site.
                    </p>
                </section>
            </div>
        </div>
    );
}