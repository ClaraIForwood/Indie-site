import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DissertationContent from "./DissertationContent";

export const metadata: Metadata = {
  title: "Dissertation — Stock Market Direction Prediction",
  description:
    "Comparing LSTM, Transformer, XGBoost, MLP and Logistic Regression on 23 years of S&P 500 daily equity data. ECM3175 final-year dissertation, University of Exeter.",
};

export default function DissertationPage() {
  return (
    <>
      <div className="bg-linear-to-b from-slate-50 from-70% to-slate-950">
        <Nav />
      </div>
      <DissertationContent />
      <Footer />
    </>
  );
}
