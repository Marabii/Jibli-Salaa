export default function FormImages() {
  return (
    <>
      <label className="block mb-4">
        <span className="text-gray-600">
          Upload images of the product you're ordering
        </span>
        <input
          type="file"
          name="selectedFiles"
          accept="image/*"
          required
          multiple
          className="mt-1 block w-full p-2 border rounded border-gray-300"
        />
      </label>
    </>
  );
}
