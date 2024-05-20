"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
// import { signInBtnFunc } from "./components/signInWithGoogle";
// import { signInEmailBtnFunc } from "./components/signInWithEmail";
import logo from "../assets/logo.png";
import { signIn } from "next-auth/react";
import { signInBtnFunc } from "./components/signInWithGoogle";

// const DemoPaper = styled(Paper)(({ theme }) => ({
//   width: 120,
//   height: 120,
//   padding: theme.spacing(2),
//   ...theme.typography.body2,
//   textAlign: "center",
// }));

const Login = () => {
  // ------------------ SHOW LOGIN ---------------------
  // const router = useRouter();
  // const [showLogin, setShowLogin] = useState(false);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("http://localhost:3000/api/auth/user");
  //     if (response.ok) {
  //       const responseJson = await response.json();
  //       if (!responseJson.user) {
  //         setShowLogin(true);
  //       } else if (responseJson.user) {
  //         router.push("/home");
  //       }
  //     } else {
  //       console.error("Fetch failed:", response.statusText);
  //     }
  //   };

  //   fetchData(); // Call the function to fetch data on component mount
  // }, []);

  // ---------------------------------LOGIC --------------------------------------
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [loading, setLoading] = React.useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  const [gLoading, setGLoading] = React.useState(false);

  function handleClickGoogle() {
    setGLoading(true);
    document.getElementsByClassName("GoogleSignInBtn")[0].click();
    setTimeout(() => {
      setGLoading(false);
    }, 3000);
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="flex w-screen h-screen">
      <div className=" w-2/5 h-fit m-auto border-gray-400 border-2 rounded-lg grid">
        <div className=" flex m-auto my-2 mt-8">
          <img src={logo.src} alt="logo" className=" w-10 h-10 mx-2 my-2" />
          <span className=" mx-auto my-2 text-3xl font-light">
           Welcome back to <span className=" font-semibold">Team Up</span>!
          </span>
        </div>
        {/* --------------------- EMAIL AUTH ---------------- */}
        <form action={()=>{}} className=" mx-auto my-2 grid">
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="mx-auto my-2 w-50 border-gray-300 border-2 px-4 py-2 rounded-md focus:outline-blue-300"
          />
          {/* <input
            type="password"
            name="password"
            placeholder="Password..."
            className="mx-auto my-2 w-50 border-gray-300 border-2 px-4 py-2 rounded-md focus:outline-blue-300"
          /> */}
          <button
            type="submit"
            className=" mx-auto my-2 w-full bg-blue-500 px-4 py-2 text-white rounded-md  active:bg-blue-600 transition"
          >
            Log In
          </button>
        </form>
        <hr className=" w-1/2 border-gray-400 my-0 m-auto" />
        <form action={signInBtnFunc} className=" mx-auto my-2 grid mb-8">
          <button
            type="submit"
            className=" mx-auto my-2 mt-6 w-full bg-blue-100 px-10 py-2 text-black font-semibold rounded-md  active:bg-blue-200 transition flex"
          >
            <img
              width="28"
              height="28"
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="google-logo"
              className=" mr-2 ml-0 pl-0"
            />
            Sign In with Google
          </button>
        </form>
      </div>
    </div>
    // <div className="flex w-screen h-screen">
    // <Stack direction="row" spacing={2} className=" w-2/5 h-fit m-auto ">
    //   <DemoPaper
    //     variant="outlined"
    //     className="w-full border-2 h-full text-2xl stack"
    //   >
    //     <span className="m-2">Log In</span>
    //     <br />
    //     <TextField
    //       id="outlined-basic"
    //       label="Email"
    //       variant="outlined"
    //       className=" m-2 w-2/5"
    //       size="small"
    //     />
    //     <br />
    //     <FormControl
    //       sx={{ m: 1 }}
    //       className="w-2/5 m-2"
    //       size="small"
    //       variant="outlined"
    //     >
    //       <InputLabel htmlFor="outlined-adornment-password">
    //         Password
    //       </InputLabel>
    //       <OutlinedInput
    //         id="outlined-adornment-password"
    //         type={showPassword ? "text" : "password"}
    //         endAdornment={
    //           <InputAdornment position="end">
    //             <IconButton
    //               aria-label="toggle password visibility"
    //               onClick={handleClickShowPassword}
    //               onMouseDown={handleMouseDownPassword}
    //               edge="end"
    //             >
    //               {showPassword ? <VisibilityOff /> : <Visibility />}
    //             </IconButton>
    //           </InputAdornment>
    //         }
    //         label="Password"
    //       />
    //     </FormControl>
    //     <br />
    //     <LoadingButton
    //       size="medium"
    //       onClick={handleClick}
    //       endIcon={<ArrowForwardIosIcon />}
    //       loading={loading}
    //       loadingPosition="end"
    //       variant="contained"
    //       className="shadow-none hover:shadow-none w-2/5 m-2"
    //     >
    //       <span>LogIn</span>
    //     </LoadingButton>
    //     <br />
    //     <form action={signInBtnFunc} className="formGSignin">
    //       <button className=' hidden GoogleSignInBtn' type="submit"></button>
    //           <LoadingButton
    //             size="large"
    //             onClick={handleClickGoogle}
    //             startIcon={<GoogleIcon />}
    //             loading={gLoading}
    //             loadingPosition="start"
    //             variant="outlined"
    //             className="shadow-none hover:shadow-none w-2/5 m-2"

    //           >
    //             <span>Sign in with Google</span>
    //           </LoadingButton>
    //     </form>
    //   </DemoPaper>
    // </Stack>
    // </div>
  );
  //   <div className="flex w-screen h-screen">
  //     <Stack direction="row" spacing={2} className=" w-2/5 h-fit m-auto">
  //       <DemoPaper
  //         variant="outlined"
  //         className="w-full border-2 h-full text-2xl"
  //       >
  //         <span className="m-2">Log In</span>
  //         <br />
  //         <TextField
  //           id="outlined-basic"
  //           label="Email"
  //           variant="outlined"
  //           className=" m-2 w-2/5"
  //           size="small"
  //         />
  //         <br />
  //         <FormControl
  //           sx={{ m: 1 }}
  //           className="w-2/5 m-2"
  //           size="small"
  //           variant="outlined"
  //         >
  //           <InputLabel htmlFor="outlined-adornment-password">
  //             Password
  //           </InputLabel>
  //           <OutlinedInput
  //             id="outlined-adornment-password"
  //             type={showPassword ? "text" : "password"}
  //             endAdornment={
  //               <InputAdornment position="end">
  //                 <IconButton
  //                   aria-label="toggle password visibility"
  //                   onClick={handleClickShowPassword}
  //                   onMouseDown={handleMouseDownPassword}
  //                   edge="end"
  //                 >
  //                   {showPassword ? <VisibilityOff /> : <Visibility />}
  //                 </IconButton>
  //               </InputAdornment>
  //             }
  //             label="Password"
  //           />
  //         </FormControl>
  //         <br />
  //         <LoadingButton
  //           size="medium"
  //           onClick={handleClick}
  //           endIcon={<ArrowForwardIosIcon />}
  //           loading={loading}
  //           loadingPosition="end"
  //           variant="contained"
  //           className="shadow-none hover:shadow-none w-2/5 m-2"
  //         >
  //           <span>LogIn</span>
  //         </LoadingButton>
  //         <br />
  //         <form action={signInBtnFunc} className="formGSignin">
  //           <button className=' hidden GoogleSignInBtn' type="submit"></button>
  //             {/* <div> */}
  //               <LoadingButton
  //                 size="large"
  //                 onClick={handleClickGoogle}
  //                 startIcon={<GoogleIcon />}
  //                 loading={gLoading}
  //                 loadingPosition="start"
  //                 variant="outlined"
  //                 className="shadow-none hover:shadow-none w-2/5 m-2"

  //               >
  //                 <span>Sign in with Google</span>
  //               </LoadingButton>
  //             {/* </div> */}
  //           {/* </button> */}
  //         </form>
  //       </DemoPaper>
  //     </Stack>
  //   </div>
  // );
  // // <div>
  // //   {" "}
  // //   <div
  // //     style={{
  // //       display: "flex",
  // //       justifyContent: "center",
  // //       alignItems: "center",
  // //       backgroundColor: "#f8f4f3",
  // //       minHeight: "100vh",

  // //       margin: "0px",
  // //       padding: "0px",
  // //     }}
  // //   >
  // //     <div
  // //       style={{
  // //         borderStyle: "double",
  // //         borderRadius: "5px",
  // //         minWidth: "60vw",
  // //         backgroundColor: "white",
  // //       }}
  // //     >
  // //       <form>
  // //         <Box
  // //           display="flex"
  // //           flexDirection={"column"}
  // //           alignItems={"center"}
  // //           justifyContent={"center"}
  // //           borderRadius={2}
  // //         >
  // //           <h2>Login</h2>

  // //           <TextField
  // //             margin="normal"
  // //             id="email"
  // //             placeholder="Email"
  // //             autoComplete="email"
  // //             name="email"
  // //             // value={details.email}
  // //             // error={errors.email}
  // //             // helperText={errors.email && "Email is required."}
  // //             // onChange={changeHandler}
  // //             // autoFocus
  // //             sx={{ width: "50%", minHeight: "20px" }}
  // //           />

  // //           <TextField
  // //             margin="normal"
  // //             id="password"
  // //             placeholder="Password"
  // //             type="password"
  // //             name="password"
  // //             // value={details.password}
  // //             // error={errors.password}
  // //             // helperText={errors.password && "Password is required."}
  // //             // onChange={changeHandler}
  // //             autoComplete="password"
  // //             sx={{ width: "50%", minHeight: "20px" }}
  // //           />

  // //           <Button
  // //             sx={{
  // //               marginTop: 1,
  // //               marginBottom: 2,
  // //               width: "50%",
  // //               height: "50px",
  // //             }}
  // //             style={{
  // //               borderRadius: 3,
  // //               backgroundColor: "black",
  // //               padding: "10px 10px",
  // //               fontSize: "20px",
  // //             }}
  // //             variant="contained"
  // //             type="submit"
  // //           >
  // //             Login
  // //           </Button>
  // //         </Box>
  // //       </form>
  // //           <form
  // //             action={signInBtnFunc}
  // //           >
  // //             <Button
  // //               sx={{
  // //                 marginTop: 1,
  // //                 marginBottom: 2,
  // //                 width: "50%",
  // //                 height: "50px",
  // //               }}
  // //               style={{
  // //                 borderRadius: 3,
  // //                 backgroundColor: "black",
  // //                 padding: "10px 10px",
  // //                 fontSize: "20px",
  // //               }}
  // //               variant="contained"
  // //               type="submit"
  // //             >
  // //               Google Sign In
  // //             </Button>
  // //           </form>
  // //     </div>
  // //   </div>
  // // </div>
};

export default Login;
