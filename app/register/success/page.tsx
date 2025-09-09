"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";

interface SuccessPayload {
	team: {
		team_name: string;
		school_name: string;
		school_district: string;
		lead_phone: string;
		lead_email: string;
	};
	members: Array<{
		name: string;
		gender: string;
		grade: string;
		phone: string;
		email: string;
		food_preference?: string;
		is_team_lead?: boolean;
	}>;
	project: {
		idea_title: string;
		problem_statement: string;
		solution_idea: string;
		implementation_plan: string;
		beneficiaries: string;
		teamwork_contribution: string;
	};
	teacher: {
		salutation: string;
		teacher_name: string;
		teacher_phone: string;
	};
	payment: {
		paymentId: string;
		orderId: string;
		// signature intentionally not stored/displayed
	};
	meta?: {
		teamId?: string;
		teamCode?: string;
		createdAt?: string;
	};
}

export default function RegistrationSuccessPage() {
	const [data, setData] = useState<SuccessPayload | null>(null);
	const printRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		try {
			const raw = sessionStorage.getItem("gen201_registration_success");
			if (raw) {
				setData(JSON.parse(raw));
			}
		} catch (err) {
			console.error("Failed to load success data", err);
		}
	}, []);

	const termsText = useMemo(() => (
		`Terms & Conditions (Summary)\n\n` +
		`- Participation limited to Class 11 and 12 students.\n` +
		`- Fee is non-refundable (except extraordinary situations decided by organizers).\n` +
		`- Payment does not guarantee selection to offline hackathon.\n` +
		`- Payments are processed by Razorpay; technical issues are not the organizer's liability.\n` +
		`- Organizer decisions regarding selection/refunds are final.\n` +
		`- The registering individual is responsible for informing all team members of these terms.`
	), []);

	const handleDownloadPdf = async () => {
		if (!data) return;
		const pdf = new jsPDF("p", "mm", "a4");
		const pageWidth = pdf.internal.pageSize.getWidth();

		pdf.setFontSize(18);
		pdf.text("GEN 201 - Registration Receipt", 10, 15);
		pdf.setDrawColor(115, 3, 192);
		pdf.line(10, 18, pageWidth - 10, 18);

		pdf.setFontSize(12);
		const yStart = 28;
		let y = yStart;
		const row = (label: string, value: string) => {
			pdf.setTextColor(146, 141, 171);
			pdf.text(label, 10, y);
			pdf.setTextColor(255, 255, 255);
			pdf.text(value, 60, y);
			y += 8;
		};

		// Only these three fields
		row("Payment ID", data.payment.paymentId);
		row("Team Code", data.meta?.teamCode || "");
		row("Date", new Date(data.meta?.createdAt || Date.now()).toLocaleString());

		// Terms page
		pdf.addPage();
		pdf.setFontSize(14);
		pdf.text("Agreed Terms & Conditions", 10, 15);
		pdf.setFontSize(10);
		const split = pdf.splitTextToSize(termsText, pageWidth - 20);
		pdf.text(split as string[], 10, 25);
		pdf.save("GEN201_Registration.pdf");
	};

	if (!data) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
				<div className="text-center">
					<p className="text-[#928dab]">Loading registration details...</p>
					<Link href="/" className="inline-block mt-4 bg-[#7303c0] text-white px-6 py-2 clip-polygon hover:bg-[#928dab]">
						Go to Home
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white p-4 sm:p-6">
			<div className="max-w-4xl mx-auto space-y-6">
				<h1 className="text-2xl sm:text-3xl font-orbitron text-[#7303c0]">Registration Successful</h1>
				<p className="text-[#928dab]">Your payment and registration are complete. Save or export the details below for your records.</p>

				<div ref={printRef} className="space-y-6">
					{/* Payment Info */}
					<div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-4 sm:p-6 clip-polygon">
						<h2 className="font-orbitron text-xl text-[#928dab] mb-4">Payment Information</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
							<div><span className="text-[#928dab]">Payment ID:</span> {data.payment.paymentId}</div>
							{/* Order ID intentionally hidden */}
							{data.meta?.teamId && (
								<div><span className="text-[#928dab]">Team ID:</span> {data.meta.teamId}</div>
							)}
							{(data.meta?.teamCode) && (
								<div><span className="text-[#928dab]">Team Code:</span> {data.meta.teamCode}</div>
							)}
							{data.meta?.createdAt && (
								<div><span className="text-[#928dab]">Date:</span> {new Date(data.meta.createdAt).toLocaleString()}</div>
							)}
						</div>
					</div>

					{/* Team Info */}
					<div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-4 sm:p-6 clip-polygon">
						<h2 className="font-orbitron text-xl text-[#928dab] mb-4">Team Information</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
							<div><span className="text-[#928dab]">Team Name:</span> {data.team.team_name}</div>
							<div><span className="text-[#928dab]">School:</span> {data.team.school_name}</div>
							<div><span className="text-[#928dab]">District:</span> {data.team.school_district}</div>
							<div><span className="text-[#928dab]">Lead Phone:</span> {data.team.lead_phone}</div>
							<div><span className="text-[#928dab]">Lead Email:</span> {data.team.lead_email}</div>
						</div>
					</div>

					{/* Members */}
					<div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-4 sm:p-6 clip-polygon">
						<h2 className="font-orbitron text-xl text-[#928dab] mb-4">Team Members</h2>
						<div className="space-y-3 text-sm">
							{data.members.map((m, idx) => (
								<div key={idx} className="border border-[#7303c0]/40 p-3">
									<div className="font-semibold text-white">{m.name} {m.is_team_lead ? '(Lead)' : ''}</div>
									<div className="text-[#928dab]">Grade {m.grade} • {m.gender}</div>
									<div>Phone: {m.phone}</div>
									<div>Email: {m.email}</div>
									{m.food_preference && <div>Food: {m.food_preference}</div>}
								</div>
							))}
						</div>
					</div>

					{/* Project */}
					<div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-4 sm:p-6 clip-polygon">
						<h2 className="font-orbitron text-xl text-[#928dab] mb-4">Project Details</h2>
						<div className="space-y-2 text-sm">
							<div><span className="text-[#928dab]">Idea Title:</span> {data.project.idea_title}</div>
							<div>
								<span className="text-[#928dab]">Problem Statement:</span>
								<p className="whitespace-pre-wrap">{data.project.problem_statement}</p>
							</div>
							<div>
								<span className="text-[#928dab]">Solution Idea:</span>
								<p className="whitespace-pre-wrap">{data.project.solution_idea}</p>
							</div>
							<div>
								<span className="text-[#928dab]">Implementation Plan:</span>
								<p className="whitespace-pre-wrap">{data.project.implementation_plan}</p>
							</div>
							<div><span className="text-[#928dab]">Beneficiaries:</span> {data.project.beneficiaries}</div>
							<div><span className="text-[#928dab]">Teamwork Contribution:</span> <span className="whitespace-pre-wrap">{data.project.teamwork_contribution}</span></div>
						</div>
					</div>

					{/* Teacher */}
					<div className="bg-black/30 backdrop-blur-sm border border-[#7303c0] p-4 sm:p-6 clip-polygon">
						<h2 className="font-orbitron text-xl text-[#928dab] mb-4">Teacher Verification</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
							<div><span className="text-[#928dab]">Salutation:</span> {data.teacher.salutation}</div>
							<div><span className="text-[#928dab]">Name:</span> {data.teacher.teacher_name}</div>
							<div><span className="text-[#928dab]">Phone:</span> {data.teacher.teacher_phone}</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
					<button onClick={handleDownloadPdf} className="bg-[#7303c0] hover:bg-[#928dab] text-white px-6 py-2 clip-polygon">Download PDF</button>
					<Link href="/" className="bg-[#928dab] hover:bg-[#7303c0] text-white px-6 py-2 clip-polygon text-center">Go to Home</Link>
				</div>
			</div>
		</div>
	);
}
