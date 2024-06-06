import React, { useState, useEffect } from "react";
import { signIn, useSession, getSession } from "next-auth/react";
import Menu from "../../components/Menu";
import Link from "next/link";
import { Modal } from "react-bootstrap";

function Dashboard({ customers, schedules, messages }) {
	const { data: session, status } = useSession();
	const loading = status === "loading";

	const [isModalOpen, setModalOpen] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [customerEmail, setCustomerEmail] = useState("");

	const [customerPhone, setCustomerPhone] = useState("");
	const [customerAddress, setCustomerAddress] = useState("");

	const handleOpenModal = () => setModalOpen(true);
	const handleCloseModal = () => setModalOpen(false);

	const handleAddCustomer = async (event) => {
		event.preventDefault();
		const response = await fetch("/api/customers", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				first_name: firstName,
				last_name: lastName,
				email: customerEmail,
			}),
		});

		if (response.ok) {
			setModalOpen(false);
			// Optionally reset form or refresh data
			setFirstName("");
			setCustomerEmail("");
			// Refresh customers list if needed
		} else {
			alert("Failed to add customer");
		}
	};

	useEffect(() => {
		if (!loading && !session) {
			signIn("github", { callbackUrl: "/dashboard" });
		}
	}, [loading, session]);

	if (loading) {
		return <h2>Loading...</h2>;
	}

	if (!session) {
		return null; // Avoid rendering anything while redirecting
	}

	const isLoggedIn = session && session.user;
	return (
		<>
			<Modal
				className="text-white"
				size=""
				show={isModalOpen}
				onHide={() => setModalOpen(false)}
				backdrop="static">
				<Modal.Header closeButton={false}>
					<Modal.Title id="main-modal-title">Add new Customer</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form
						onSubmit={handleAddCustomer}
						className="row">
						<div className="col-6 form-group mb-2">
							<label className="control-label">First Name:</label>
							<input
								className="form-control"
								type="text"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder="Enter name"
							/>
						</div>
						<div className="col-6 form-group mb-2">
							<label className="control-label">Last Name:</label>
							<input
								className="form-control"
								type="text"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								placeholder="Enter name"
							/>
						</div>
						<div className="col-6 form-group mb-2">
							<label className="control-label">Email:</label>
							<input
								className="form-control"
								type="email"
								value={customerEmail}
								onChange={(e) => setCustomerEmail(e.target.value)}
								placeholder="Enter email"
							/>
						</div>
						<div className="col-6 form-group mb-2">
							<label className="control-label">Phone:</label>
							<input
								className="form-control"
								type="tel"
								value={customerPhone}
								onChange={(e) => setCustomerPhone(e.target.value)}
								placeholder="Enter phone"
							/>
						</div>
						<div className="col-12 form-group mb-2">
							<label className="control-label">Address:</label>
							<input
								className="form-control"
								type="text"
								value={customerAddress}
								onChange={(e) => setCustomerAddress(e.target.value)}
								placeholder="Enter address"
							/>
						</div>

						<div className="mt-2 d-flex justify-content-center">
							<button
								type="button"
								className="btn btn-secondary me-3"
								onClick={handleCloseModal}>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-brand ">
								Add
							</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>

			<div className="page-wrapper toggled">
				<Menu />
				<main className="page-content ">
					<div className="container-fluid">
						<div className="layout-specing">
							<div className="card">
								<h5 className="mb-0 text-white p-4">
									{isLoggedIn ? (
										<p>Welcome {session.user.name}</p>
									) : (
										<p>Welcome Admin</p>
									)}
								</h5>
							</div>
							{/* Session USer {session} */}
							<div className="row">
								<div className="col-lg-5 mt-4">
									<div className="card border-0 rounded shadow p-4">
										<h5 className="mb-0 mb-3 text-white">
											Total Customers ({customers.length})
										</h5>
										<div className="text-muted mb-0 text-center">
											<img
												src={`../images/${
													customers.length === 0
														? "avatar.png"
														: "avatar-colored.png"
												}`}
												className="img-fluid"
												width={100}
											/>

											<div className="h6 py-1">No recently added Customers</div>
											<div className="py-1">
												<button
													className="btn btn-lg btn-brand"
													onClick={handleOpenModal}>
													<i className="ti ti-plus me-2"></i> Add Customer
												</button>
											</div>
											<Link
												href="/customers/"
												className="py-2 link-brand">
												View all <i className="ti ti-arrow-right ms-2"></i>
											</Link>
										</div>
									</div>
								</div>
								<div className="col-lg-7 mt-4">
									<div className="card border-0 rounded shadow p-4">
										<div className="d-flex justify-content-between">
											<h5 className="mb-0 mb-3 text-white">
												Schedules Pickup - ({schedules.length})
											</h5>
											<div>
												<Link
													href="/schedules/"
													className="link-brand">
													View all <i className="ti ti-arrow-right ms-2"></i>
												</Link>
											</div>
										</div>

										<div className="text-muted mb-0">
											{schedules.length === 0 ? (
												<div
													className="d-flex justify-content-center align-items-center  card"
													style={{ minHeight: "220px" }}>
													<img
														src="../images/calendar.png"
														className="img-fluid"
														width={100}
													/>
													<div className="h6">No activity to report now</div>
												</div>
											) : (
												<table className="table">
													{/* Table Header */}
													<thead>
														<tr>
															<th>#</th>
															<th>Name</th>
															<th>Phone</th>
															<th>Address</th>
															<th>Date</th>
														</tr>
													</thead>
													{/* Table Body */}
													<tbody>
														{schedules.map((schedule, index) => (
															<tr key={index}>
																<td>{index + 1}</td>
																<td>
																	<Link
																		className="link-brand"
																		href={`schedules/${schedule.id}`}
																		passHref>
																		{schedule.name}
																	</Link>
																</td>
																<td>{schedule.phone}</td>
																<td>{schedule.address}</td>
																<td>{schedule.date}</td>
															</tr>
														))}
													</tbody>
												</table>
											)}
										</div>
									</div>
								</div>
								<div className="col-12 mt-4">
									<div className="card border-0 rounded shadow p-4">
										<div className="d-flex justify-content-between">
											<h5 className="mb-0 mb-3 text-white">
												Messages ({messages.length})
											</h5>
											<div>
												<Link
													href="/messages/"
													className="link-brand">
													View all <i className="ti ti-arrow-right ms-2"></i>
												</Link>
											</div>
										</div>
										<div className="text-muted mb-0">
											{messages.length === 0 ? (
												<div
													className="d-flex justify-content-center align-items-center  card"
													style={{ minHeight: "220px" }}>
													<img
														src="../images/message.png"
														className="img-fluid"
														width={100}
													/>
													<div className="h6">No data to report now</div>
												</div>
											) : (
												<table className="table">
													{/* Table Header */}
													<thead>
														<tr>
															<th>#</th>
															<th>Name</th>
															{/* <th>Email</th> */}
															<th>Phone</th>
															<th>Subject</th>
															<th>Message</th>
														</tr>
													</thead>
													{/* Table Body */}
													<tbody>
														{messages.map((message, index) => (
															<tr key={index}>
																<td>{index + 1}</td>
																<td>{message.name}</td>
																{/* <td>{message.email}</td> */}
																<td>{message.phone}</td>
																<td>{message.subject}</td>
																<td className="ellipsis">
																	<Link
																		className="link-brand"
																		href={`messages/${message.id}`}
																		passHref>
																		{message.body}
																	</Link>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											)}
										</div>
									</div>
								</div>
							</div>
							{/* <!--end row--> */}
						</div>
					</div>
				</main>
			</div>
		</>
	);
}

export default Dashboard;

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const api = process.env.NEXT_PUBLIC_API_LOCAL;
	const customerResponse = await fetch(`${api}/customers`);
	const customerData = await customerResponse.json();

	const scheduleResponse = await fetch(`${api}/schedules`);
	const scheduleData = await scheduleResponse.json();
	// Only keep the last 3 schedules
	const limitedScheduleData = scheduleData.slice(-3);

	const messageResponse = await fetch(`${api}/messages`);
	const messageData = await messageResponse.json();

	const limitedMessageData = messageData.slice(-3);

	if (!session) {
		return {
			redirect: {
				destination: `${process.env.LOGIN_URL}`, //redirect to login page
				permanent: false,
			},
		};
	}
	return {
		props: {
			customers: session ? customerData : "",
			schedules: session ? limitedScheduleData : "",
			messages: session ? limitedMessageData : "",
		},
	};
}
