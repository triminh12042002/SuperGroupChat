import axios from "axios";
import { useState } from "react";

function PromptImage(props) {
    const { addPrompt, setAddPrompt, image, setImage, generatingImage, setGeratingImage, setUpdateMess } = props;
    const [prompt, setPrompt] = useState('');
    // const [addPrompt, setAddPrompt] = useState(false);

    const generate = async () => {
        try {
            if (!generatingImage) {
                setGeratingImage(true);
                const result = await axios.get(`http://127.0.0.1:8000/?prompt=${prompt}`);
                setImage(result.data);
                // console.log(result);
                console.log('image-result.data in gen');
                console.log(result.data);

                setUpdateMess(true);
                // console.log('promptMessRef in gen', promptMessRef);
                // console.log('mess', messRef);

                // add image the the mess that have prompted this 

                // setPromptMessRef(null);
                setGeratingImage(false);
                // setAddPrompt(false);
            } else {
                alert('Stable Diffusion server is busy now, please try again later');
            }
        } catch (error) {
            alert('Error generating image', error);
            console.log('error', error);
            setGeratingImage(false);
        }
    }

    return (
        <div className='input-group containerWrap gap-2 mt-2'>
            {addPrompt ? (
                <div className='input-group gap-2'>
                    <input className='p-2 ' onChange={(e) => setPrompt(e.target.value)} placeholder='enter your prompt here' value={prompt} />
                    <button className='bg-white p-2' onClick={generate}>Promts</button>
                    {image ? <img src={`data:image/png;base64,${image}`} className=' w-60 h-60' /> : null}
                    {generatingImage &&
                        <div className="flex p-2 bg-black" disabled>
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <div className="text-white">generating image</div>
                        </div>}

                </div>
            ) :
                <button className='bg-white p-2' onClick={() => setAddPrompt(true)}>Add image to message </button>
            }

        </div>
    )
}

export default PromptImage;