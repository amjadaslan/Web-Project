import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FC } from 'react';
import { PaymentDetails } from '../../Models/PaymentDetails';

export interface PaymentFormProps {
  paymentDetails: PaymentDetails,
  setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>
}

export const PaymentForm: FC<PaymentFormProps> = ({ paymentDetails, setPaymentDetails }) => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            value={paymentDetails.cardHolder}
            onChange={(val) => setPaymentDetails(paymentDetails.UpdateCardHolder(val.target.value))}
            fullWidth
            autoComplete="cc-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            value={paymentDetails.cardNumber}
            onChange={(val) => setPaymentDetails(paymentDetails.UpdateCardNumber(val.target.value))}
            fullWidth
            autoComplete="cc-number"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            value={paymentDetails.expiryDate}
            onChange={(val) => setPaymentDetails(paymentDetails.UpdateExpiryDate(val.target.value))}
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            label="CVV"
            value={paymentDetails.cvv}
            onChange={(val) => setPaymentDetails(paymentDetails.UpdateCvv(val.target.value))}
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            variant="standard"
          />
        </Grid>
        {/* <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid> */}
      </Grid>
      <Typography variant="body1" gutterBottom>
        Apply Coupon:
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="coupon"
            name="coupon"
            label="Coupon Code"

            value={paymentDetails.coupon}
            onChange={(val) => setPaymentDetails(paymentDetails.UpdateCoupon(val.target.value))}
            fullWidth
            variant="standard"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}