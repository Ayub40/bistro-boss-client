import { useForm } from "react-hook-form";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { FaUtensils } from "react-icons/fa";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddItems = () => {
    const { register, handleSubmit, reset } = useForm()
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async (data) => {
        console.log(data);
        // image upload to imgbb and then get an url
        const imgFile = { image: data.image[0] }
        const res = await axiosPublic.post(image_hosting_api, imgFile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });
        if (res.data.success) {
            // now send the menu item data to the server with the image url
            const menuItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                recipe: data.recipe,
                image: res.data.data.display_url
            }
            // 
            const menuRes = await axiosSecure.post('/menu', menuItem);
            console.log(menuRes.data)
            if (menuRes.data.insertedId) {
                // show success popup
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `${data.name} is added to the menu`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
        console.log('with image url', res.data);
    };

    return (
        <div>
            <SectionTitle heading='add an item' subHeading="what's new ?"></SectionTitle>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <label>First Name</label> */}
                    {/* <input  /> */}
                    <label className="form-control w-full my-6">
                        <div className="label">
                            <span className="label-text">Recipe name*</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Recipe Name"
                            {...register("name", { required: true })}
                            required
                            className="input input-bordered w-full" />

                    </label>
                    <div className="flex gap-6">
                        {/* category */}
                        <label className="form-control w-full my-6">
                            <div className="label">
                                <span className="label-text">Category*</span>
                            </div>
                            <select defaultValue="default" {...register("category", { required: true })}
                                className="select select-bordered w-full">
                                <option disabled value="default">Select a category</option>
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">Soup</option>
                                <option value="dessert">dessert</option>
                                <option value="drinks">Drinks</option>
                            </select>

                        </label>
                        {/* price */}
                        <label className="form-control w-full my-6">
                            <div className="label">
                                <span className="label-text">Price*</span>
                            </div>
                            <input
                                type="number"
                                placeholder="Price"
                                {...register("price", { required: true })}
                                className="input input-bordered w-full" />

                        </label>
                    </div>
                    {/* recipe details */}
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Recipe Details*</span>
                        </div>
                        <textarea
                            {...register("recipe")}
                            className="textarea textarea-bordered h-24"
                            placeholder="Bio">
                        </textarea>

                    </label>
                    <div className="form-control w-full my-6">
                        <input
                            {...register("image", { required: true })}
                            type="file"
                            className="file-input w-full max-w-xs" />
                    </div>

                    <button className="bg-gradient-to-r from-[#835D23] to-[#B58130] btn text-white">
                        Add Item <FaUtensils className="ml-2"></FaUtensils>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddItems;