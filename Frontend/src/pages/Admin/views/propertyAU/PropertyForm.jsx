import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useProperties } from "../../../../context/PropertyContex";
import { ArrowLeft } from "lucide-react";

dayjs.extend(utc);

const COLORS = {
  PRIMARY: "#2563eb",
  SECONDARY: "#3b82f6",
  ACCENT: "#1d4ed8",
  BACKGROUND: "#f8fafc",
  ERROR: "#ef4444",
  SUCCESS: "#22c55e",
  TEXT: {
    PRIMARY: "#0f172a",
    SECONDARY: "#475569",
    LIGHT: "#94a3b8",
  },
};

const styles = {
  mainContainer: { minHeight: '100vh', padding: '2rem', background: 'linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%)' },
  formContainer: { maxWidth: '1200px', margin: '0 auto', position: 'relative' },
  formCard: { padding: '2rem', borderRadius: '1rem', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  formTitle: { textAlign: 'center', fontWeight: '600', fontSize: '1.875rem', color: COLORS.TEXT.PRIMARY, marginBottom: '2rem' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  inputGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.5rem', color: COLORS.TEXT.SECONDARY },
  input: { width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' },
  textarea: { minHeight: '120px', resize: 'vertical' },
  error: { color: COLORS.ERROR, fontSize: '0.75rem', marginTop: '0.25rem' },
  imageGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' },
  imagePreview: { width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #e2e8f0' },
  button: { 
    padding: '0.75rem 1.5rem', 
    borderRadius: '0.5rem', 
    fontWeight: '500', 
    border: 'none', 
    cursor: 'pointer', 
    color: 'white', 
    background: COLORS.PRIMARY,
  },
  removeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'rgba(239, 68, 68, 0.8)',
    color: 'white',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem'
  }
};

const tiposInmueble = [
  "Casa",
  "Apartamento",
  "Local",
  "Oficina",
  "Bodega",
  "Lote",
  "Finca"
];

const tiposNegocio = [
  "Venta",
  "Arriendo",
  "Arriendo/Venta"
];

const estados = [
  "Nuevo",
  "Usado",
  "En construcción",
  "Sobre planos"
];

const fields = [
  { name: "title", label: "Título", required: true, minLength: 2, maxLength: 100 },
  { name: "pais", label: "País", required: true },
  { name: "departamento", label: "Departamento", required: true },
  { name: "ciudad", label: "Ciudad", required: true },
  { name: "zona", label: "Zona", required: true },
  { name: "areaConstruida", label: "Área Construida (m²)", required: true, type: "number" },
  { name: "areaTerreno", label: "Área Terreno (m²)", required: true, type: "number" },
  { name: "areaPrivada", label: "Área Privada (m²)", required: true, type: "number" },
  { name: "alcobas", label: "Alcobas", required: true, type: "number", integer: true },
  { name: "costo", label: "Costo", required: true, type: "number" },
  { name: "banos", label: "Baños", required: true, type: "number", integer: true },
  { name: "garaje", label: "Garajes", required: true, type: "number", integer: true },
  { name: "estrato", label: "Estrato", required: true, type: "number", integer: true },
  { name: "piso", label: "Piso", required: true, type: "number", integer: true },
  { name: "tipoInmueble", label: "Tipo de Inmueble", required: true, select: true, options: tiposInmueble },
  { name: "tipoNegocio", label: "Tipo de Negocio", required: true, select: true, options: tiposNegocio },
  { name: "estado", label: "Estado", required: true, select: true, options: estados },
  { name: "valorAdministracion", label: "Valor Administración", required: true, type: "number" },
  { name: "anioConstruccion", label: "Año de Construcción", required: true, type: "number", integer: true },
  { name: "description", label: "Descripción", required: true, minLength: 10, maxLength: 1000 }
];

const DEFAULT_VALUES = {
  title: "",
  pais: "",
  departamento: "",
  ciudad: "",
  zona: "",
  areaConstruida: "",
  areaTerreno: "",
  areaPrivada: "",
  alcobas: "",
  costo: "",
  banos: "",
  garaje: "",
  estrato: "",
  piso: "",
  tipoInmueble: "",
  tipoNegocio: "",
  estado: "",
  valorAdministracion: "",
  anioConstruccion: "",
  description: "",
};

export const PropertyForm = () => {
  const { createProperty, getProperty, updateProperty } = useProperties();
  const navigate = useNavigate();
  const params = useParams();
  const [selectedImages, setSelectedImages] = useState([]);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
    defaultValues: DEFAULT_VALUES
  });

  const ImagePreview = ({ image, index, onRemove }) => (
    <div style={{ position: 'relative' }}>
      <img 
        src={image instanceof File ? URL.createObjectURL(image) : image}
        alt={`Preview ${index + 1}`}
        style={styles.imagePreview}
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        style={styles.removeButton}
      >
        ×
      </button>
    </div>
  );

  useEffect(() => {
    const loadProperty = async () => {
      if (params.id) {
        try {
          const property = await getProperty(params.id);
          Object.keys(property).forEach((key) => {
            if (key === "images") {
              setSelectedImages(property[key]);
            } else {
              setValue(key, property[key]);
            }
          });
        } catch (error) {
          setServerError("No se pudo cargar la propiedad");
          console.error("Property loading error:", error);
        }
      }
    };
    loadProperty();
  }, [params.id, setValue, getProperty]);

  const onSubmit = async (data) => {
    try {
      if (selectedImages.length === 0) {
        setServerError("Debe subir al menos una imagen");
        return;
      }

      setIsSubmitting(true);
      setServerError("");
      const formData = new FormData();

      selectedImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      const numericFields = [
        "areaConstruida", "areaTerreno", "areaPrivada", 
        "alcobas", "costo", "banos", "garaje", 
        "estrato", "piso", "valorAdministracion", 
        "anioConstruccion"
      ];
      
      Object.keys(data).forEach((key) => {
        const value = numericFields.includes(key) ? Number(data[key]) : data[key];
        formData.append(key, value);
      });

      if (params.id) {
        await updateProperty(params.id, formData);
      } else {
        await createProperty(formData);
      }

      navigate("/properties");
    } catch (error) {
      console.error("Form submission error:", error);
      setServerError(error.response?.data?.message || "Error al procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + selectedImages.length > 15) {
      setServerError("No puedes subir más de 15 imágenes");
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setServerError("Solo se permiten archivos de imagen");
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setServerError("Cada imagen debe ser menor a 5MB");
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles].slice(0, 15));
      setServerError("");
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderField = (field, options = {}) => {
    const { type = "text", select = false, options: selectOptions = [] } = options;

    return (
      <div key={field.name} style={styles.inputGroup}>
        <label style={styles.label} htmlFor={field.name}>
          {field.label}
          {field.required && <span style={{ color: COLORS.ERROR }}> *</span>}
        </label>
        <Controller
          name={field.name}
          control={control}
          rules={{
            required: field.required ? "Este campo es requerido" : false,
            ...(type === "number" && {
              min: { value: 0, message: "El valor debe ser positivo" },
              validate: {
                isNumber: value => !isNaN(value) || "Debe ser un número válido",
                ...(field.integer && {
                  isInteger: value => Number.isInteger(Number(value)) || "Debe ser un número entero"
                })
              }
            }),
            ...(field.minLength && {
              minLength: {
                value: field.minLength,
                message: `Mínimo ${field.minLength} caracteres`
              }
            }),
            ...(field.maxLength && {
              maxLength: {
                value: field.maxLength,
                message: `Máximo ${field.maxLength} caracteres`
              }
            })
          }}
          render={({ field: { onChange, value, ref } }) => {
            if (select) {
              return (
                <select
                  style={styles.input}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                >
                  <option value="">Seleccione una opción</option>
                  {selectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            }
            
            if (field.name === "description") {
              return (
                <textarea
                  style={{...styles.input, ...styles.textarea}}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              );
            }

            return (
              <input
                style={styles.input}
                type={type}
                onChange={(e) => {
                  if (type === "number" && e.target.value < 0) {
                    e.target.value = 0;
                  }
                  onChange(e);
                }}
                min={type === "number" ? 0 : undefined}
                value={value}
                ref={ref}
                step={field.integer ? "1" : "any"}
              />
            );
          }}
        />
        {errors[field.name] && (
          <span style={styles.error}>{errors[field.name].message}</span>
        )}
      </div>
    );
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.formContainer}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: '-4rem', left: '0', padding: '0.75rem 1.25rem' }}
        >
          <ArrowLeft size={18} /> Volver
        </button>

        <div style={styles.formCard}>
          <h1 style={styles.formTitle}>
            {params.id ? "Editar Propiedad" : "Nueva Propiedad"}
          </h1>
          
          {serverError && (
            <div style={{...styles.error, marginBottom: '1rem', textAlign: 'center'}}>
              {serverError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={styles.formGrid}>
              {fields.map((field) => renderField(field, {
                type: field.type,
                select: field.select,
                options: field.options
              }))}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Imágenes ({selectedImages.length}/15)
                <span style={{ color: COLORS.ERROR }}> *</span>
              </label>
              <input 
                type="file" 
                multiple 
                onChange={handleImageChange} 
                accept="image/*"
                style={{...styles.input, padding: '0.5rem'}}
              />
              
              <div style={styles.imageGrid}>
                {selectedImages.map((image, index) => (
                  <ImagePreview 
                    key={index}
                    image={image}
                    index={index}
                    onRemove={removeImage}
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.button,
                opacity: (isSubmitting || selectedImages.length === 0) ? 0.5 : 1,
                cursor: (isSubmitting || selectedImages.length === 0) ? 'not-allowed' : 'pointer'
              }}
              disabled={isSubmitting || selectedImages.length === 0}
            >
              {isSubmitting 
                ? 'Procesando...' 
                : params.id 
                  ? "Actualizar Propiedad" 
                  : "Crear Propiedad"
              }
            </button>
          </form>
        </div>

        {isSubmitting && (
          <div style={styles.overlay}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={styles.spinner} />
              <p>Procesando imágenes y guardando datos...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Agregar estilos CSS para la animación del spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default PropertyForm;