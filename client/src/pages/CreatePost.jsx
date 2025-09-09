import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', prompt: '', photo: '' });

  // const post_Url = "imagetotextbackend-production.up.railway.app";
  const post_Url = "https://divinestudio.pro";

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageCount, setImageCount] = useState(0);

  useEffect(() => {
    try {
      const count = localStorage.getItem('imageCount');
      if (count) setImageCount(parseInt(count, 10));
    } catch { /* ignore */ }
  }, []);

  const generateImage = async () => {
    if (!form.prompt) {
      alert('Please provide a prompt');
      return;
    }

    // Respect existing limit logic, keep copy neutral
    if (imageCount >= 20) {
      alert('You have reached your daily image limit.');
      return;
    }

    try {
      setGeneratingImg(true);
      const response = await fetch(`${post_Url}/api/v1/imgGenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_STABILITY_AI_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: form.prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
        const newCount = imageCount + 1;
        setImageCount(newCount);
        try { localStorage.setItem('imageCount', String(newCount)); } catch { /* ignore */ }
      } else {
        throw new Error(data.error || 'Something went wrong!');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(form.prompt && form.photo)) {
      alert('Please enter a prompt and generate an image');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${post_Url}/api/v1/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (response.ok) {
        navigate('/');
      } else {
        throw new Error(result.error || 'Failed to share post');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="text-center animate-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-strong))]">AI</span> Images
        </h1>
        <p className="mt-3 text-base md:text-lg opacity-80">
          Unleash the power of Divine Studio to turn your wildest ideas into stunning visuals.
          Share your imagination with the community!
        </p>
      </div>

      {/* Form */}
      <form className="mt-12 max-w-3xl glass p-6 md:p-7 rounded-2xl animate-in" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex. John Doe"
            value={form.name}
            handleChange={handleChange}
            className="input"
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A Bollywood dance party with dancers in vibrant traditional attire..."
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
            className="input"
          />

          {/* Preview */}
          <div
            className="relative glass-strong border-0 text-sm rounded-xl w-64 h-64 flex justify-center items-center overflow-hidden elevate"
            aria-live="polite"
            aria-busy={generatingImg ? 'true' : 'false'}
          >
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt || 'Generated preview'}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-60 rounded-xl">
                <img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain" />
              </div>
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-10 flex justify-center items-center bg-black/45 rounded-xl">
                <Loader />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={generateImage}
            className={`btn btn-accent ${generatingImg ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={generatingImg}
          >
            {generatingImg ? 'Generating…' : 'Generate'}
          </button>

          {form.photo && (
            <button
              type="submit"
              className={`btn ${loading ? 'opacity-70 cursor-progress' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sharing…' : 'Share with the Community'}
            </button>
          )}
        </div>

        {/* Helper */}
        <div className="mt-6 text-sm opacity-75">
          Generated today: <span className="font-medium">{imageCount}</span>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
