import React from "react";
import { C } from "../App";

export default function MentionsLegales({ dark }) {
    const txt = dark ? "#f0eef8" : "#0d0b1a";
    const muted = dark ? "#8b8aaa" : "#6a6880";

    return (
        <div style={{ 
            paddingTop: "140px", 
            paddingBottom: "100px",
            minHeight: "100vh", 
            maxWidth: "800px", 
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            color: txt,
            fontFamily: "Corbel, sans-serif"
        }}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "40px" }}>
                Mentions Légales
            </h1>

            <section style={{ marginBottom: "28px" }}>
                <p style={{ color: muted, lineHeight: "1.6" }}>
                    Selon l'article 6 de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique,<br /> 
                    il est précisé ci-après l'identité des différents intervenant·es dans le cadre de la réalisation et du suivi du site 
                </p>
            </section>

            <section style={{ marginBottom: "28px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>1. Édition du site</h2>
                <p style={{ color: muted, lineHeight: "1.6" }}>
                    Le présent site web, accessible à l'adresse [URL EN COURS DE CREATION], est édité par Marie Coroller,<br />
                    représentante de l'entreprise individuelle Coroller Illustration et Crochet au code APE 9003A <br />
                    (Création artistique relevant des arts plastiques) et dont le numéro SIRET est le suivant : 94266318800012.<br />
                    L'adresse de celle-ci est : 52 rue Georges Rouault – 81000 Albi.<br />
                    Directrice de la publication : Marie Coroller<br />
                    Contact : coroller.marie@orange.fr <br />
                    <br />
                    Le site a été conçu et développé par Aïny Ourzik.
                </p>
            </section>

            <section style={{ marginBottom: "28px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>2. Hébergement</h2>
                <p style={{ color: muted, lineHeight: "1.6" }}>
                    Le site est hébergé par [Vercel ?].<br />
                    Adresse de l'hébergeur : [Adresse physique de l'hébergeur]
                </p>
            </section>

            <section style={{ marginBottom: "28px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>3. Propriété intellectuelle</h2>
                <p style={{ color: muted, lineHeight: "1.6" }}>
                    Toutes les illustrations, photographies, logos, textes et autres visuels présents sur ce site sont la propriété exclusive de Marie Coroller, sauf indication contraire. Ils sont donc protégés par le droit d'auteur. 
Ainsi, toute utilisation de tout ou partie de ces visuels sans autorisation écrite préalable est interdite. Toute exploitation non autorisée du site ou des éléments qu'il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle. 

                </p>
            </section>

            <section style={{ marginBottom: "28px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>4. Utilisation des données personnelles</h2>
                <p style={{ color: muted, lineHeight: "1.6" }}>
                    Conformément au Règlement générale sur la Protection des données (RGPG) du 25 mai 2018, 
                    nous nous engageons à respecter vos données privées. Vos données seront traitées de la manière suivante : <br />
                    . 1 Données recueillies <br />  
                    Nous ne recueillons que les données que vous nous fournissez via le formulaire de contact : nom, prénom, adresse mail, message.
                    Ces données sont les informations nécessaires pour échanger et vous fournir un service et/ou un produit adapté.
                    Les données recueillies ne seront traitées que par Marie Coroller, et ne seront partagées avec aucun partenaire ou autre service service étranger.<br />
                    Selon la loin Informatique et Libertés, en date du 6 janvier 1978, vous avez le droit d'accès, de rectification, suppression et opposition de vos données personnelles. Vous pouvez exercer ce droit en nous écrivant directement par mail. 
                    <br />
                    . 2 Cookies <br />
                    La CNIL définit un « cookie » comme étant un petit fichier d’information envoyé sur le navigateur des utilisateurices et enregistré au sein du terminal (ordinateur, smartphone). 
                    Ce fichier comprend des informations telles que le nom de domaine, le fournisseur d’accès Internet, le système d’exploitation, ainsi que la date et l’heure d’accès. Les Cookies ne risquent en aucun cas d’endommager le terminal. <br />
                    Nous n'utilisons ici que des cookies nécessaires au bon fonctionnement du site. <br />
                    Vous apportez votre consentement éclairé via acceptation ou non de ces cookies en arrivant sur le site. Toutefois, le refus ne permettra pas de garantir une expérience optimale. 

                </p>
            </section>

            <section style={{ marginBottom: "28px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>5. Limitation de responsabilité
</h2>
                <p style={{ color: muted, lineHeight: "1.6" }}>
                    Marie Coroller en tant qu'éditrice du site, est responsable de la qualité et de la véracité du contenu publié. 

                </p>
            </section>

            <section style={{ marginBottom: "28px" }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", marginBottom: "12px" }}>6. Liens Hypertextes

</h2>
                <p style={{ color: muted, lineHeight: "1.6" }}>
                    Marie Coroller s'engage à vérifier régulièrement le bon fonctionnement des liens hypertextes vers des sites 
                    extérieurs pouvant apparaître. Toutefois, elle ne pourra être tenue responsable de leur contenu ni de leur bon 
                    fonctionnement. L'accès à ces autres sites est soumis à la responsabilité des utilisateurices. 
                    <br />
                    <br />
                    <em>Mise à jour des Mentions Légales : mai 2026</em>
                </p>
            </section>
            
        </div>
    );
}