import "server-only";
import Input from "@/components/Input";

export default function FormUsualInputs() {
  return (
    <div className="z-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Please fill out your order details
      </h2>

      {/* Product URL */}
      <Input
        className="w-full border-2 border-black p-5"
        type="text"
        name="productURL"
        label="Product URL (Optional)"
        pattern={String(/^https?:\/\/[^\s/$.?#].[^\s]*$/)}
        errorMessage="Please enter a valid URL."
      />

      {/* Estimated Value */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        name="estimatedValue"
        label="Estimated Value:"
        pattern={String(/^(1[1-9]|[2-9][0-9]|[1-9][0-9]{2,})$/)}
        errorMessage="Please enter a number higher than 10."
        initialValue={10}
        required
      />

      {/* Product Name */}
      <Input
        className="w-full border-2 border-black p-5"
        type="text"
        name="productName"
        label="Product Name"
        pattern={String(/^[a-zA-Z0-9 .,'-]{3,100}$/)}
        errorMessage="Product name is required, 3-100 characters, and may contain letters, numbers, spaces, and . , ' -"
        required
      />

      {/* Description */}
      <Input
        className="w-full border-2 border-black p-5"
        type="text"
        name="description"
        label="Description"
        pattern={String(/^[a-zA-Z0-9\s.,'"-]{10,1000}$/)}
        errorMessage="Description is required, 10-1000 characters, and may contain letters, numbers, spaces, and . , ' \"
        isTextarea={true}
        required
      />

      {/* Quantity */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        label="How many items are you willing to buy?"
        name="quantity"
        pattern={String(/^([1-9]|[1-9][0-9]+)$/)}
        errorMessage="Quantity must be at least 1."
        initialValue={1}
        required
      />

      {/* Length in cm */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        label="Length in cm"
        name="dimensions.lengthInCm"
        pattern={String(/^[1-9]\d*$/)}
        errorMessage="Length must be a positive number."
        required
      />

      {/* Width in cm */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        label="Width in cm"
        name="dimensions.widthInCm"
        pattern={String(/^[1-9]\d*$/)}
        errorMessage="Width must be a positive number."
        required
      />

      {/* Height in cm */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        label="Height in cm"
        name="dimensions.heightInCm"
        pattern={String(/^[1-9]\d*$/)}
        errorMessage="Height must be a positive number."
        required
      />

      {/* Special Instructions */}
      <Input
        className="w-full border-2 border-black p-5"
        type="text"
        label="Special Instructions"
        name="deliveryInstructions"
        pattern={String(/^[a-zA-Z0-9\s.,'"-]{10,1000}$/)}
        errorMessage="Delivery instructions must be 10-1000 characters and may contain letters, numbers, spaces, and . , ' \"
        isTextarea={true}
      />

      {/* Initial Delivery Fee */}
      <Input
        className="w-full border-2 border-black p-5"
        type="number"
        label="Declare how much you're willing to pay the traveler"
        name="initialDeliveryFee"
        pattern={String(/^[5-9]\d*$|^\d{2,}$/)}
        errorMessage="Delivery fee must be larger than 5."
        initialValue={5}
        required
      />
    </div>
  );
}
