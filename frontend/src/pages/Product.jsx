import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, clearProductDetails } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../utils/api';

// --- Reusable SVG Icons ---
const PawIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.5 7.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5.5 12c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5S4.12 12 5.5 12zm13 0c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zM12 11.5c-2.48 0-4.5 2.02-4.5 4.5 0 2.83 2.5 5 4.5 5s4.5-2.17 4.5-5c0-2.48-2.02-4.5-4.5-4.5z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

const TruckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

// --- Custom Hover Magnifier & Live Mockup Component ---
const ImageMagnifier = ({ src, alt, textLayers = [], customTexts = {}, showLiveOverlay = true, isRenderingPreview = false }) => {
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div 
      className="relative w-full aspect-square overflow-hidden bg-stone-50 cursor-zoom-in rounded-3xl group border border-stone-200"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ containerType: 'inline-size' }}
    >
      <img 
        src={src} 
        alt={alt} 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`} 
      />

      {/* Instant CSS Overlay (Automatically hides once official Printify 3D mockup is rendered) */}
      {showLiveOverlay && !isRenderingPreview && textLayers.map((layer) => {
        const currentText = customTexts[layer.field_id];
        if (!currentText || currentText === layer.default_text) return null;

        return (
          <div
            key={layer.field_id}
            className={`absolute flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
            style={{
              top: `${(layer.y ?? 0.5) * 100}%`,
              left: `${(layer.x ?? 0.5) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${layer.angle || 0}deg)`,
              color: layer.font_color || '#1c1917',
              fontFamily: layer.font_family || 'sans-serif',
              textAlign: layer.text_align || 'center',
              fontSize: 'clamp(1rem, 7cqw, 3.5rem)',
              width: '80%',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.2',
              textShadow: layer.font_color === '#ffffff' ? '0px 2px 4px rgba(0,0,0,0.4)' : '0px 1px 2px rgba(255,255,255,0.6)',
            }}
          >
            {currentText}
          </div>
        );
      })}

      {/* Loading Overlay while Printify renders the 3D mockup */}
      {isRenderingPreview && (
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs flex flex-col items-center justify-center text-white z-10">
          <PawIcon className="w-10 h-10 text-amber-400 animate-bounce mb-2" />
          <p className="text-sm font-bold tracking-wide uppercase">Rendering Official 3D Mockup...</p>
        </div>
      )}

      {isHovering && !isRenderingPreview && (
        <div 
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition,
            backgroundSize: '250%'
          }}
        />
      )}

      {!isHovering && !isRenderingPreview && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center shadow-sm pointer-events-none">
          <PawIcon className="w-4 h-4 text-amber-500 mr-1.5" />
          <span className="text-xs font-bold text-stone-900 tracking-wide uppercase">
            {showLiveOverlay ? 'Pet Approved' : 'Official 3D Preview'}
          </span>
        </div>
      )}
    </div>
  );
};

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { productDetails: product, isLoading, error } = useSelector((state) => state.products);

  const [activeImage, setActiveImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  // Personalization State
  const [apiPersonalizationFields, setApiPersonalizationFields] = useState([]);
  const [customTexts, setCustomTexts] = useState({});
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [hasRenderedOfficialPreview, setHasRenderedOfficialPreview] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const pollTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductDetails(id));

    // Fetch official Printify Personalization Options
    const fetchPersonalizationFields = async () => {
      try {
        const { data } = await api.get(`/products/${id}/personalization-options`);
        if (Array.isArray(data)) {
          setApiPersonalizationFields(data);
        } else if (data?.fields || data?.data) {
          setApiPersonalizationFields(data.fields || data.data);
        }
      } catch (err) {
        console.error('Could not load personalization options:', err);
      }
    };

    fetchPersonalizationFields();

    return () => {
      dispatch(clearProductDetails());
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, [dispatch, id]);

  // Unified Personalization Fields: Uses official API options first, or falls back to print_areas text/svg layers
  const personalizationFields = useMemo(() => {
    const svgCoordinatesMap = {};
    const fallbackLayers = [];

    product?.print_areas?.forEach((area) => {
      area.placeholders?.forEach((placeholder) => {
        placeholder.images?.forEach((img, idx) => {
          if (img.type === 'text/svg') {
            svgCoordinatesMap[img.id] = img;
            fallbackLayers.push({
              field_id: img.id,
              label: `Custom Text ${fallbackLayers.length + 1}`,
              type: 'textbox',
              character_limit: 50,
              default_text: img.input_text || '',
              x: img.x,
              y: img.y,
              angle: img.angle,
              font_color: img.font_color,
              font_family: img.font_family,
              text_align: img.text_align,
              isOfficialApi: false,
            });
          }
        });
      });
    });

    if (apiPersonalizationFields.length > 0) {
      return apiPersonalizationFields.map((field, idx) => {
        const coords = svgCoordinatesMap[field.field_id] || fallbackLayers[idx] || {};
        return {
          ...field,
          field_id: field.field_id,
          label: field.label || `Personalization ${idx + 1}`,
          type: field.type || 'textbox',
          character_limit: field.character_limit || 40,
          default_text: field.default_value || coords.default_text || '',
          x: coords.x ?? 0.5,
          y: coords.y ?? 0.5,
          angle: coords.angle || 0,
          font_color: coords.font_color || '#1c1917',
          font_family: coords.font_family || 'sans-serif',
          text_align: coords.text_align || 'center',
          isOfficialApi: true,
        };
      });
    }

    return fallbackLayers;
  }, [product, apiPersonalizationFields]);

  useEffect(() => {
    if (product) {
      setGalleryImages(product.images || []);
      const defaultImg = product.images.find((img) => img.is_default) || product.images[0];
      setActiveImage(defaultImg?.src || '');

      const defaultVariant =
        product.variants.find((v) => v.is_default && v.is_enabled) ||
        product.variants.find((v) => v.is_enabled);

      if (defaultVariant) {
        setSelectedOptions(defaultVariant.options);
      }
    }
  }, [product]);

  // Initialize input values
  useEffect(() => {
    if (personalizationFields.length > 0) {
      const initialTexts = {};
      personalizationFields.forEach((field) => {
        initialTexts[field.field_id] = field.default_text || '';
      });
      setCustomTexts(initialTexts);
    }
  }, [personalizationFields]);

  const currentVariant = useMemo(() => {
    if (!product || selectedOptions.length === 0) return null;
    return product.variants.find((variant) =>
      selectedOptions.every((optId) => variant.options.includes(optId))
    );
  }, [product, selectedOptions]);

  const handleOptionChange = (optionIndex, valueId) => {
    const newOptions = [...selectedOptions];
    newOptions[optionIndex] = parseInt(valueId, 10);
    setSelectedOptions(newOptions);
  };

  const handleTextChange = (fieldId, value) => {
    setCustomTexts((prev) => ({ ...prev, [fieldId]: value }));
    // Re-enable live CSS overlay if user edits text after rendering an official preview
    if (hasRenderedOfficialPreview) {
      setHasRenderedOfficialPreview(false);
    }
  };

  // Format payload items for Printify Personalization API
  const buildPersonalizationItemsPayload = () => {
    return personalizationFields.map((field) => ({
      field_id: field.field_id,
      type: field.type || 'textbox',
      input: {
        text: customTexts[field.field_id] || '',
      },
    }));
  };

  // Poll Printify Task Status until processed
  const pollPreviewTask = async (taskId, attempts = 0) => {
    if (attempts > 20) {
      setIsRenderingPreview(false);
      setPreviewError('Preview generation timed out. Please try again.');
      return;
    }

    try {
      const { data } = await api.get(`/products/${product.id}/personalization-previews/tasks/${taskId}`);
      const status = data.status?.toLowerCase();

      if (status === 'succeeded' || status === 'processed' || status === 'completed' || data.mockups?.length > 0) {
        const renderedMockups = data.mockups || data.images || data.result?.mockups || [];
        if (renderedMockups.length > 0) {
          const formattedMockups = renderedMockups.map((m, idx) => ({
            src: m.src || m.url || m,
            position: m.position || `preview-${idx}`,
          }));
          setGalleryImages(formattedMockups);
          setActiveImage(formattedMockups[0].src);
          setHasRenderedOfficialPreview(true);
        }
        setIsRenderingPreview(false);
      } else if (status === 'failed' || status === 'error') {
        setIsRenderingPreview(false);
        setPreviewError(data.error || 'Printify could not render this preview.');
      } else {
        // Still pending/processing — poll again in 1.5s
        pollTimeoutRef.current = setTimeout(() => pollPreviewTask(taskId, attempts + 1), 1500);
      }
    } catch (err) {
      setIsRenderingPreview(false);
      setPreviewError('Error checking preview status.');
    }
  };

  // Request Official Rendered Mockup Preview from Printify
  const handleRequestOfficialPreview = async () => {
    if (!currentVariant) return;
    setPreviewError('');
    setIsRenderingPreview(true);

    try {
      const items = buildPersonalizationItemsPayload();
      const { data } = await api.post(`/products/${product.id}/personalization-previews`, {
        variant_id: currentVariant.id,
        items,
        require_all_personalization_fields: false,
      });

      const taskId = data.task_id || data.id;
      if (taskId) {
        pollPreviewTask(taskId);
      } else if (data.mockups?.length > 0) {
        // If returned synchronously
        setGalleryImages(data.mockups);
        setActiveImage(data.mockups[0].src || data.mockups[0]);
        setHasRenderedOfficialPreview(true);
        setIsRenderingPreview(false);
      }
    } catch (err) {
      setIsRenderingPreview(false);
      setPreviewError(
        err.response?.data?.message ||
          'Official 3D preview requires Personalization to be enabled on this product in your Printify dashboard.'
      );
    }
  };

  const handleAddToCart = async () => {
    if (!currentVariant) return;

    let personalisationStrategy = null;
    let personalisationInstructions = null;

    const hasUserEnteredText = Object.values(customTexts).some((val) => val && val.trim() !== '');

    if (personalizationFields.length > 0 && hasUserEnteredText) {
      setIsSavingConfig(true);
      try {
        const items = buildPersonalizationItemsPayload();
        const { data } = await api.post(`/products/${product.id}/personalization`, {
          variant_id: currentVariant.id,
          items,
          require_all_personalization_fields: false,
        });
        personalisationStrategy = data.personalisation_strategy;
        personalisationInstructions = data.personalisation_instructions;
      } catch (err) {
        // Fallback to manual strategy if official personalization endpoint isn't enabled on Printify dashboard
        personalisationStrategy = 'manual';
        personalisationInstructions = Object.entries(customTexts)
          .map(([key, val]) => `${key}: ${val}`)
          .join(' | ');
      }
      setIsSavingConfig(false);
    }

    dispatch(
      addToCart({
        productId: product.id,
        variantId: currentVariant.id,
        name: product.title,
        image: activeImage,
        price: currentVariant.price / 100,
        quantity,
        variantTitle: product.options
          .map((opt, i) => opt.values.find((v) => v.id === selectedOptions[i])?.title)
          .join(' / '),
        personalisation: personalisationInstructions
          ? {
              personalisation_strategy: personalisationStrategy,
              personalisation_instructions: personalisationInstructions,
              customTexts,
            }
          : null,
      })
    );
  };

  const getCareInstructions = () => {
    if (!product?.safety_information) return 'No specific care instructions provided.';
    const careMatch = product.safety_information.match(/Care instructions:\s*(.+)/i);
    return careMatch ? careMatch[1] : 'Follow standard care procedures.';
  };

  if (isLoading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-stone-50">
        <PawIcon className="w-12 h-12 text-amber-500 animate-bounce mb-4" />
        <p className="text-stone-600 font-medium tracking-wide animate-pulse">Fetching details... 🐕</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-stone-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-md w-full text-center">
          <h3 className="text-lg font-bold text-stone-900 mb-2">Oops! Something went wrong.</h3>
          <p className="text-sm text-stone-500 mb-6">{error || 'This product seems to have wandered off.'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-800 transition-colors"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = currentVariant ? (currentVariant.price / 100).toFixed(2) : '0.00';
  const isOutOfStock = currentVariant ? !currentVariant.is_enabled : true;

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      <nav className="border-b border-stone-100 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm text-stone-500">
            <li><Link to="/" className="hover:text-stone-900 transition-colors">Home</Link></li>
            <li><span className="text-stone-300">/</span></li>
            <li><Link to="/shop" className="hover:text-stone-900 transition-colors">Shop All</Link></li>
            <li><span className="text-stone-300">/</span></li>
            <li className="text-stone-900 font-medium truncate">{product.title}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12">
        <div className="lg:flex lg:gap-x-16 xl:gap-x-24">
          
          {/* LEFT COLUMN: Gallery & Mockup Preview */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="lg:sticky lg:top-24">
              <ImageMagnifier
                src={activeImage}
                alt={product.title}
                textLayers={personalizationFields}
                customTexts={customTexts}
                showLiveOverlay={!hasRenderedOfficialPreview}
                isRenderingPreview={isRenderingPreview}
              />

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img.src)}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
                        activeImage === img.src
                          ? 'ring-2 ring-stone-900 ring-offset-2 scale-95'
                          : 'opacity-70 hover:opacity-100 bg-stone-50'
                      }`}
                    >
                      <img src={img.src} alt={`View ${img.position || idx}`} className="absolute inset-0 w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Options & Personalization */}
          <div className="lg:w-1/2 mt-10 lg:mt-0 pb-16">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-semibold uppercase tracking-wider rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 mb-4 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-stone-900">${currentPrice}</p>
                {isOutOfStock && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <hr className="border-stone-100 my-8" />

            {/* Variant Dropdowns */}
            <div className="space-y-6">
              {product.options.map((option, index) => (
                <div key={option.name}>
                  <label htmlFor={`option-${index}`} className="block text-sm font-bold text-stone-900 uppercase tracking-wide mb-2">
                    Select {option.name}
                  </label>
                  <div className="relative">
                    <select
                      id={`option-${index}`}
                      value={selectedOptions[index] || ''}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full appearance-none border-2 border-stone-200 rounded-xl px-4 py-3.5 text-base font-medium text-stone-900 bg-white hover:border-stone-300 focus:outline-none focus:border-stone-900 transition-colors cursor-pointer"
                    >
                      <option value="" disabled>Choose a {option.name}</option>
                      {option.values.map((val) => (
                        <option key={val.id} value={val.id}>{val.title}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Printify Personalization Engine */}
            {personalizationFields.length > 0 && (
              <div className="mt-8 border-2 border-amber-200 bg-amber-50/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide flex items-center">
                    <PawIcon className="w-4 h-4 mr-2 text-amber-500" /> Personalize Your Gear
                  </h3>
                  <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Live Preview Active
                  </span>
                </div>

                <div className="space-y-4">
                  {personalizationFields.map((field) => {
                    const currentVal = customTexts[field.field_id] || '';
                    return (
                      <div key={field.field_id}>
                        <div className="flex justify-between text-xs font-semibold text-stone-600 mb-1.5 uppercase tracking-wide">
                          <label htmlFor={`field-${field.field_id}`}>{field.label}</label>
                          {field.character_limit && (
                            <span>{currentVal.length} / {field.character_limit}</span>
                          )}
                        </div>
                        <input
                          id={`field-${field.field_id}`}
                          type="text"
                          maxLength={field.character_limit || 100}
                          value={currentVal}
                          onChange={(e) => handleTextChange(field.field_id, e.target.value)}
                          placeholder={field.default_text || 'Enter custom text...'}
                          className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-base text-stone-900 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                        />
                      </div>
                    );
                  })}

                  {/* Trigger Printify's Official personalization_previews.json API */}
                  <button
                    type="button"
                    onClick={handleRequestOfficialPreview}
                    disabled={isRenderingPreview}
                    className="w-full mt-2 py-3 px-4 rounded-xl border-2 border-stone-900 text-stone-900 font-bold text-sm hover:bg-stone-900 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isRenderingPreview ? 'Generating Official Printify Mockup...' : '✨ Render Official 3D Mockup Preview'}
                  </button>

                  {previewError && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{previewError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between border-2 border-stone-200 rounded-2xl bg-white w-full sm:w-40 h-14 overflow-hidden shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors flex items-center justify-center"
                >
                  &minus;
                </button>
                <span className="w-10 text-center font-semibold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 h-full text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors flex items-center justify-center"
                >
                  &#43;
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isSavingConfig}
                className={`flex-1 flex justify-center items-center h-14 rounded-2xl text-base font-bold transition-all duration-300 cursor-pointer ${
                  isOutOfStock || isSavingConfig
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 hover:-translate-y-0.5'
                }`}
              >
                {isOutOfStock ? (
                  'Currently Unavailable'
                ) : isSavingConfig ? (
                  <span className="animate-pulse">Saving Personalization...</span>
                ) : (
                  <>Add to Cart <PawIcon className="w-5 h-5 ml-2 text-white/90" /></>
                )}
              </button>
            </div>

            {/* Trust Signals */}
            <div className="mt-8 grid grid-cols-2 gap-4 py-6 border-y border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldIcon className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-stone-900">Secure Checkout</p>
                  <p className="text-stone-500 text-xs mt-0.5">256-bit encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <TruckIcon className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-stone-900">Fast Fulfillment</p>
                  <p className="text-stone-500 text-xs mt-0.5">Printed on demand</p>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-8">
              <div className="flex border-b border-stone-200">
                {['description', 'care', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                      activeTab === tab
                        ? 'border-stone-900 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {tab === 'care' ? 'Care & Info' : tab}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                {activeTab === 'description' && (
                  <div
                    className="prose prose-sm prose-stone text-stone-600 max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: product.description.replace(/(\.:)/g, '<br/>•'),
                    }}
                  />
                )}

                {activeTab === 'care' && (
                  <div className="text-sm text-stone-600 space-y-4">
                    <div>
                      <h4 className="font-bold text-stone-900 mb-1">Care Instructions</h4>
                      <p className="leading-relaxed">{getCareInstructions()}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="text-sm text-stone-600 space-y-4">
                    <p>📦 <strong>Production Time:</strong> 2-4 business days for custom printing.</p>
                    <p>🚚 <strong>Shipping:</strong> 3-7 business days depending on your location.</p>
                    <p>↩️ <strong>Returns:</strong> Custom personalized items are final sale unless defective.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
