import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Review } from './Review';
import { EcommerceAppBar } from '../components/EcommerceAppbar/EcommerceAppBar';
import { PaymentDetails } from '../../Models/PaymentDetails';
import { CartItem } from '../../Models/Cart';
import { FC, useState } from 'react';
import { PaymentForm } from './PaymentForm';
import { ShippingDetails } from '../../Models/ShippingDetails';
import { AddressForm } from './AddressForm';
import { MakeOrder } from './CheckoutAxiosCalls';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

const theme = createTheme();

export interface CheckoutProps {
    setAppBarTitle: React.Dispatch<React.SetStateAction<string>>,
    cartItems: CartItem[]
}

export const Checkout: FC<CheckoutProps> = ({ setAppBarTitle, cartItems }) => {
    // const [cardType, setCardType] = useState<string>("VISA");
    // const [cardHolder, setCardHolder] = useState<string>("");
    // const [cardNumber, setCardNumber] = useState<string>("");
    // const [expiryDate, setExpiryDate] = useState<string>("");
    // const [coupon, setCoupon] = useState<string>("");

    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(new PaymentDetails());
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>(new ShippingDetails());

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <AddressForm shippingDetails={shippingDetails} setShippingDetails={setShippingDetails} />;
            case 1:
                return <PaymentForm paymentDetails={paymentDetails} setPaymentDetails={setPaymentDetails} />;
            case 2:
                return <Review paymentDetails={paymentDetails} shippingDetails={shippingDetails} cartItems={cartItems} />;
            default:
                throw new Error('Unknown step');
        }
    }

    const [currentStep, setCurrentStep] = React.useState(0);

    const handleNext = async () => {
        if (currentStep == 2) {
            await MakeOrder(shippingDetails, paymentDetails)
                .then((_) => {
                    setCurrentStep(currentStep + 1);
                })
                .catch((err) => {
                    console.log("Error occured while creating order")
                    console.log(err);
                })
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const secondaryButton = currentStep == 0 ?
        <Button onClick={() => { console.log("Supposed to go back to cart.") }} sx={{ mt: 3, ml: 1 }}>
            Cancel
        </Button>
        :
        <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
            Back
        </Button>;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* <EcommerceAppBar appBarTitle='Checkout' /> */}
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper activeStep={currentStep} sx={{ pt: 3, pb: 5 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {currentStep === steps.length ? (
                        <React.Fragment>
                            <Typography variant="h5" gutterBottom>
                                Thank you for your order.
                            </Typography>
                            <Typography variant="subtitle1">
                                Your order number is #2001539. We have emailed your order
                                confirmation, and will send you an update when your order has
                                shipped.
                            </Typography>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {getStepContent(currentStep)}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {secondaryButton}
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 3, ml: 1 }}
                                >
                                    {currentStep === steps.length - 1 ? 'Place order' : 'Next'}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}