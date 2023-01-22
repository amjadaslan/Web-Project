import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FC, useState } from "react"
import { Product, validProductCategories } from "../../../Models/Product";
import { CapitalFirstLetter } from "../../components/helperMethods";
import { AddProduct } from "./ProductDashboardAxiosCalls";

export interface ProductDetailsDialogProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    existingProduct: Product | null,
    onConfirm : (prd: Product) => Promise<any>
}

export const ProductDetailsDialog: FC<ProductDetailsDialogProps> = ({ isOpen, setIsOpen, existingProduct, onConfirm}) => {

    const handleConfirm = async () => {
        await onConfirm(new Product("", productName, category, description, price, stock, imageUrl))
            .then((_) => {
                setIsOpen(false);
                restoreFieldValues();
            })
            .catch((_) => {
                console.log("An Error has Occured while adding Product");
            })
    };

    const handleClose = () => {
        setIsOpen(false);
        restoreFieldValues();
    }

    const restoreFieldValues = () => {
        setProductName(existingProduct?.name || "");
        setCategory(existingProduct != null ? category : "");
        setDescription(existingProduct?.description || "");
        setPrice(existingProduct?.price || 0);
        setStock(existingProduct?.stock || 0);
        setImageUrl(existingProduct?.image || "");
    }

    const [productName, setProductName] = useState<string>(existingProduct?.name || "");
    const [category, setCategory] = useState<string>(existingProduct?.category || "");
    const [description, setDescription] = useState<string>(existingProduct?.description || "");
    const [price, setPrice] = useState<number>(existingProduct?.price || 0);
    const [stock, setStock] = useState<number>(existingProduct?.stock || 0);
    const [imageUrl, setImageUrl] = useState<string>(existingProduct?.image || "");

    return (
        <div>
            <Dialog open={isOpen} onClose={handleClose}>
                <DialogTitle>Enter Product Details</DialogTitle>
                <DialogContent>
                    <DialogContentText gutterBottom>
                        Please enter the relevant details for your product
                    </DialogContentText>
                    <Grid container spacing={3}>
                        {DialogTextField("Product Name", productName, setProductName, true)}
                        {DialogDropDown("Category", category, setCategory)}
                        {DialogTextField("Description", description, setDescription, false, false, false, true)}
                        {DialogTextField("Price", price, setPrice, true, true)}
                        {DialogTextField("Stock", stock, setStock, true, true, false)}
                        {DialogTextField("Image Url", imageUrl, setImageUrl)}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );


}

function DialogTextField(label: string, value: any, onChange: (x: any) => void, isHalf: boolean = false, isNumeric: boolean = false, allowDecimals: boolean = true, isMultiline: boolean = false): JSX.Element {
    const processedLabel = label.replaceAll(" ", "").toLowerCase();

    let processedOnChange: (val: any) => void;
    if (isNumeric && !allowDecimals) {
        processedOnChange = (val: any) => {
            val.target.value = Math.ceil(Number(val.target.value)).toString()
            onChange(Number(val.target.value));
        }
    } else if (isNumeric) {
        processedOnChange = (val: any) => {
            onChange(Number(val.target.value));
        }
    } else {
        processedOnChange = (val: any) => {
            onChange(val.target.value);
        }
    }

    return <Grid item xs={12} sm={isHalf ? 6 : false}>
        <TextField
            value={value}
            type={isNumeric ? 'number' : "text"}
            onChange={(val) => { processedOnChange(val); }}
            required
            multiline={isMultiline}
            id={processedLabel}
            name={processedLabel}
            label={label}
            fullWidth
            variant="filled"
        />
    </Grid>
}

function DialogDropDown(label: string, value: any, onChange: (x: any) => void): JSX.Element {

    return <Grid item xs={12} sm={6}>
        <FormControl required variant="filled" sx={{ minWidth: 1 }}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                onChange={(val) => onChange(val.target.value)}
                label={label}
            >
                {validProductCategories.map((category) => <MenuItem key={category} value={category}>{CapitalFirstLetter(category)}</MenuItem>)}
            </Select>
        </FormControl>
    </Grid>;
}