import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FC, useState } from "react"
import { fetchProducts } from "../../../Loaders";
import { Product, validProductCategories } from "../../../Models/Product";
import { CapitalFirstLetter } from "../../components/helperMethods";
import { AddProduct } from "./ProductDashboardAxiosCalls";

export interface ProductDetailsDialogProps {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    existingProduct: Product | null,
    onConfirm: (prd: Product) => Promise<any>
}

export const ProductDetailsDialog: FC<ProductDetailsDialogProps> = ({ isOpen, setIsOpen, existingProduct, onConfirm }) => {

    const handleConfirm = async () => {
        await onConfirm(new Product(existingProduct?.id || "", productName, category, description, price, stock, imageUrl))
            .then((_) => {
                setIsOpen(false);
                restoreFieldValues();
            })
            .catch((err) => {
                console.log(err);
                console.log("An Error has Occured in dialog");
            })
    };

    const handleClose = () => {
        setIsOpen(false);
        restoreFieldValues();

        setNameError(false);
        setDescError(false);
        setImageError(false);
    }

    const restoreFieldValues = () => {
        setProductName(existingProduct?.name || "");
        setCategory(existingProduct != null ? category : "");
        setDescription(existingProduct?.description || "");
        setPrice(existingProduct?.price || 0);
        setStock(existingProduct?.stock || 0);
        setImageUrl(existingProduct?.image || "");

        setNameError(false);
        setDescError(false);
        setImageError(false);
    }

    const [productName, setProductName] = useState<string>(existingProduct?.name || "");
    const [category, setCategory] = useState<string>(existingProduct?.category || "");
    const [description, setDescription] = useState<string>(existingProduct?.description || "");
    const [price, setPrice] = useState<number>(existingProduct?.price || 0);
    const [stock, setStock] = useState<number>(existingProduct?.stock || 0);
    const [imageUrl, setImageUrl] = useState<string>(existingProduct?.image || "");

    const [nameError, setNameError] = useState<boolean>(false);
    const [priceError, setPriceError] = useState<boolean>(false);
    const [descError, setDescError] = useState<boolean>(false);
    const [imageError, setImageError] = useState<boolean>(false);

    const StringNotEmpty = (x: string) => x.replaceAll(" ", "").replaceAll("\n", "").replaceAll("\t", "").length > 0;
    const stringEmptyErrorMessage = "Text cannot be empty!";

    const BetweenZeroAndThousand = (x: number) => x >= 0 && x <= 1000;
    const outOfRangeErrorMessage = "Price must be between 0 and 1000!"

    const AlwaysTrue = (x: any) => true;

    const initConditions = !(StringNotEmpty(productName) && StringNotEmpty(description) && BetweenZeroAndThousand(price) && StringNotEmpty(imageUrl))
    const errorExists =  initConditions || (nameError || priceError || descError || imageError);

    return (
        <div>
            <Dialog open={isOpen} onClose={handleClose}>
                <DialogTitle>Enter Product Details</DialogTitle>
                <DialogContent>
                    <DialogContentText gutterBottom>
                        Please enter the relevant details for your product
                    </DialogContentText>
                    <Grid container spacing={3}>
                        {DialogTextField(nameError, setNameError, StringNotEmpty, stringEmptyErrorMessage, "Product Name", productName, setProductName, true)}
                        {DialogDropDown("Category", category, setCategory)}
                        {DialogTextField(descError, setDescError, StringNotEmpty, stringEmptyErrorMessage, "Description", description, setDescription, false, false, false, true)}
                        {DialogTextField(priceError, setPriceError, BetweenZeroAndThousand, outOfRangeErrorMessage, "Price", price, setPrice, true, true)}
                        {DialogTextField(false, (x: any) => { }, AlwaysTrue, "", "Stock", stock, setStock, true, true, false)}
                        {DialogTextField(imageError, setImageError, StringNotEmpty, stringEmptyErrorMessage, "Image Url", imageUrl, setImageUrl)}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={errorExists}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );


}

function DialogTextField(hasError: boolean, setHasError: React.Dispatch<React.SetStateAction<boolean>>, predicate: (x: any) => boolean, helperText: string, label: string, value: any, onChange: (x: any) => void, isHalf: boolean = false, isNumeric: boolean = false, allowDecimals: boolean = true, isMultiline: boolean = false): JSX.Element {
    const processedLabel = label.replaceAll(" ", "").toLowerCase();

    let processedOnChange: (val: any) => void;
    if (isNumeric && !allowDecimals) {
        processedOnChange = (val: any) => {
            val.target.value = Math.max(0, Number(val.target.value)).toString();
            val.target.value = Math.ceil(Number(val.target.value)).toString()
            setHasError(!predicate(Number(val.target.value)));
            onChange(Number(val.target.value));
        }
    } else if (isNumeric) {
        processedOnChange = (val: any) => {
            val.target.value = Math.max(0, Number(val.target.value)).toString();
            setHasError(!predicate(Number(val.target.value)));
            onChange(Number(val.target.value));
        }
    } else {
        processedOnChange = (val: any) => {
            setHasError(!predicate(val.target.value));
            onChange(val.target.value);
        }
    }

    return <Grid item xs={12} sm={isHalf ? 6 : false}>
        <TextField
            value={value}
            error={hasError}
            helperText={hasError ? helperText : ""}
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