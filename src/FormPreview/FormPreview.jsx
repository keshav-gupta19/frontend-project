/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./FormPreview.css";

const FormPreview = ({ uiSchema }) => {
  const [formData, setFormData] = useState({});
  const [show, setShow] = useState({});
  const [ignoreState, setIgnoreState] = useState("");
  const [ignoreData, setIgnoreData] = useState(null);
  const [submitted, setSubitted] = useState(false);
  const handleInputChange = (jsonKey, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [jsonKey]: value,
    }));
  };
  const handleClick = (option, jsonKey) => {
    console.log(ignoreState);
    handleInputChange(jsonKey, option.value);
    setIgnoreState(option.value);
  };
  const toggleAdvancedFields = (jsonKey) => {
    setShow((prevShow) => ({
      ...prevShow,
      [jsonKey]: !prevShow[jsonKey],
    }));
  };
  useEffect(() => {
    const initialFormData = {};
    uiSchema?.forEach((item) => {
      if (item.validate && item.validate.required) {
        console.log("helo");
        if (item.uiType === "Switch") {
          initialFormData[item.jsonKey] = "off";
        } else if (item.uiType === "Group") {
          item.subParameters.map((subItem) => {
            if (subItem.uiType === "Switch") {
              initialFormData[subItem.jsonKey] = "off";
            }
          });
        }
      }
    });
    setFormData(initialFormData);
  }, [uiSchema]);
  const checkForValue = (value) => {
    let ddddd;
    const data = uiSchema;
    data.forEach((item) => {
      if (item.uiType === "Group") {
        item.subParameters.map((groupItem) => {
          if (groupItem.uiType === "Ignore") {
            if (groupItem.conditions[0].value === value) {
              ddddd = groupItem;
            }
          }
        });
      } else if (item.uiType === "Ignore") {
        if (item.conditions[0].value === value) {
          return item;
        }
      }
    });
    return ddddd;
    // return null;
  };
  const renderField = (field) => {
    const isRequired = field?.validate?.required;
    const jsonKey = field.jsonKey;
    if (!isRequired) {
      return (
        <div className="advanced-button">
          <button type="button" onClick={() => toggleAdvancedFields(jsonKey)}>
            {show[jsonKey] ? "Hide Advanced" : "Show Advanced"}
          </button>
          {show[jsonKey] && (
            <>
              {(() => {
                switch (field.uiType) {
                  case "Input":
                    return (
                      <div className="text-input">
                        <label>
                          {field.label}
                          {isRequired && (
                            <span className="required-star">*</span>
                          )}
                        </label>
                        <input
                          type="text"
                          placeholder={field.placeholder}
                          value={formData[field.jsonKey] || ""}
                          onChange={(e) =>
                            handleInputChange(field.jsonKey, e.target.value)
                          }
                          readOnly={field.validate && field.validate.immutable}
                          required={isRequired}
                        />
                        <div className="sep"></div>
                      </div>
                    );
                  case "Select":
                    return (
                      <div className="select-input">
                        <label>{field.label}</label>
                        {isRequired && <span className="required-star">*</span>}
                        <select
                          value={
                            formData[field.jsonKey] ||
                            field.validate.defaultValue
                          }
                          onChange={(e) =>
                            handleInputChange(field.jsonKey, e.target.value)
                          }
                          readOnly={field.validate && field.validate.immutable}
                          required={field.validate && field.validate.required}
                        >
                          <option value="" disabled selected>
                            Choose {field.label}
                          </option>
                          {field.validate.options.map((option) => (
                            <option value={option.value} key={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="sep"></div>
                      </div>
                    );
                  case "Radio":
                    return (
                      <div className="radio-input">
                        {field.options.map((option) => {
                          <div>
                            <span>{option.label}</span>
                            <button
                              onClick={handleClick(jsonKey, option.value)}
                            >
                              {option.label}
                            </button>
                          </div>;
                        })}
                        <div className="sep"></div>
                      </div>
                    );
                  case "Group":
                    return (
                      <div className="group">
                        <div className="Form-Container">
                          <p>
                            <label style={{ marginBottom: "20px" }}>
                              {field?.label}
                            </label>
                            {isRequired && (
                              <span className="required-star">*</span>
                            )}
                          </p>
                          {field?.subParameters?.map((subField) => (
                            <div key={subField?.jsonKey}>
                              <label style={{ marginBottom: "20px" }}>
                                {subField?.label}
                                {subField?.description && (
                                  <span
                                    className="info-icon"
                                    title={subField?.description}
                                  >
                                    i
                                  </span>
                                )}
                                {isRequired && (
                                  <span className="required-star">*</span>
                                )}
                              </label>
                              {renderField(subField)}
                            </div>
                          ))}
                        </div>
                        <div className="sep"></div>
                      </div>
                    );
                  default:
                    return <></>;
                }
              })()}
            </>
          )}
        </div>
      );
    }
    switch (field.uiType) {
      case "Input":
        return (
          <div className="text-input">
            <div>
              <label>{field.label}</label>
              {isRequired && <span className="required-star">*</span>}
            </div>
            <input
              type="text"
              placeholder={field.placeholder}
              value={formData[field.jsonKey] || ""}
              onChange={(e) => handleInputChange(field.jsonKey, e.target.value)}
              readOnly={field.validate && field.validate.immutable}
              required={isRequired}
            />
            <div className="sep"></div>
          </div>
        );
      case "Select":
        return (
          <div className="select-input">
            <div>
              <label>{field.label}</label>
              {isRequired && <span className="required-star">*</span>}
            </div>
            <select
              value={formData[field.jsonKey] || ""}
              onChange={(e) => handleInputChange(field.jsonKey, e.target.value)}
              readOnly={field.validate && field.validate.immutable}
              required={field.validate && field.validate.required}
            >
              <option value="" disabled hidden>
                Choose {field.label}
              </option>
              {field.validate.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="sep"></div>
          </div>
        );

      case "Radio":
        return (
          <div className="radio-input">
            {/* {isRequired && <span className="required-star">*</span>} */}
            <div className="tab-container">
              {field.validate.options.map((option, key) => (
                <div key={key}>
                  <input
                    style={{ display: "none" }}
                    type="radio"
                    name={`Radio-${field.jsonKey}`}
                    id={`Radio-${field.jsonKey}-${key}`}
                    required={isRequired}
                  />
                  <label htmlFor={`Radio-${field.jsonKey}-${key}`}>
                    <div
                      htmlFor
                      key={option.value}
                      className={`tab ${
                        formData[field.jsonKey] === option.value ? "active" : ""
                      }`}
                      onClick={() => {
                        const ignoreObj = checkForValue(option.value);
                        handleInputChange(field.jsonKey, option.value);
                        setIgnoreData(ignoreObj);
                      }}
                    >
                      {option.label}
                    </div>
                  </label>
                </div>
              ))}
              {ignoreData && renderField(ignoreData?.subParameters[0])}
            </div>
          </div>
        );
      case "Switch":
        return (
          <>
            <div className="checkbox">
              <div>
                {field.label}
                {<span className="required-star">*</span>}
              </div>
              <input
                type="checkbox"
                onChange={(e) =>
                  handleInputChange(field.jsonKey, e.target.checked)
                }
                readOnly={field.validate && field.validate.immutable}
                // required={field.validate && field.validate.required}
              />
            </div>
          </>
        );
      case "Group":
        return (
          <div className="group">
            <div className="Form-Container">
              <p>
                <label>{field?.label}</label>
                {isRequired && <span className="required-star">*</span>}
              </p>
              {field?.subParameters?.map((subField) => (
                <div key={subField?.jsonKey}>
                  <label>
                    {/* {subField?.label}
                    {subField?.description && (
                      <span className="info-icon" title={subField?.description}>
                        i
                      </span>
                    )}
                    {isRequired && <span className="required-star">*</span>} */}
                  </label>
                  {renderField(subField)}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };
  return (
    <div className="container">
      {uiSchema.length === 0 && <h1>Your Form Will Display Here</h1>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form Data Submitted:", formData);
          setSubitted(true);
        }}
      >
        <div>
          {uiSchema?.map((field, key) => (
            <div key={key}>{renderField(field)}</div>
          ))}
        </div>
        <div className="Submit-button">
          {uiSchema?.length > 0 && <button type="submit">Submit</button>}
        </div>
      </form>
      {submitted && (
        <div className="submitted-data">
          <h2>Submitted Form Data:</h2>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FormPreview;
