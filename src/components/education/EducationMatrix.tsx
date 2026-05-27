import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  educationBadges,
  educationMatrixEntries,
  educationMatrixGhostRows,
} from "./educationMatrix.data";
import "./educationMatrix.css";

export function EducationMatrix() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [selectedId, setSelectedId] = useState(
    educationMatrixEntries.find((entry) => entry.state === "active")?.id ?? educationMatrixEntries[0]?.id,
  );

  const selectedEntry =
    educationMatrixEntries.find((entry) => entry.id === selectedId) ?? educationMatrixEntries[0];

  return (
    <section ref={ref} className="education-matrix">
      <div className="education-matrix__shell">
        <motion.div
          className="education-matrix__frame"
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="education-matrix__corner education-matrix__corner--tl" />
          <span className="education-matrix__corner education-matrix__corner--tr" />
          <span className="education-matrix__corner education-matrix__corner--bl" />
          <span className="education-matrix__corner education-matrix__corner--br" />

          <div className="education-matrix__title">[ACADEMIC &amp; CERTIFICATION VERIFICATION MATRIX]</div>

          <div className="education-matrix__table-shell">
            <div className="education-matrix__selection-rail" aria-hidden>
              <span className="education-matrix__selection-text">selected</span>
              <span className="education-matrix__selection-bar" />
            </div>

            <div className="education-matrix__table-wrap">
              <table className="education-matrix__table">
                <thead>
                  <tr>
                    <th>VERIFIED NODE</th>
                    <th>TYPE</th>
                    <th>ISSUER</th>
                    <th>COMPLETION DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {educationMatrixEntries.map((entry, index) => {
                    const isSelected = entry.id === selectedEntry.id;

                    return (
                      <motion.tr
                        key={entry.id}
                        className={isSelected ? "education-matrix__row education-matrix__row--selected" : "education-matrix__row"}
                        initial={{ opacity: 0, x: -18 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.45, delay: 0.12 + index * 0.08 }}
                        onClick={() => setSelectedId(entry.id)}
                      >
                        <td>
                          <button
                            type="button"
                            className="education-matrix__node-button"
                            onClick={() => setSelectedId(entry.id)}
                          >
                            <span className="education-matrix__checkbox" aria-hidden />
                            <span>{entry.node}</span>
                          </button>
                        </td>
                        <td>{entry.type}</td>
                        <td>{entry.issuer}</td>
                        <td>{entry.completionDate}</td>
                      </motion.tr>
                    );
                  })}

                  {educationMatrixGhostRows.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      className="education-matrix__row education-matrix__row--ghost"
                      initial={{ opacity: 0, x: -18 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.34 + index * 0.08 }}
                    >
                      <td>{row.node}</td>
                      <td>{row.type}</td>
                      <td>{row.issuer}</td>
                      <td>{row.completionDate}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="education-matrix__preview">
            <motion.div
              className="education-matrix__preview-copy"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.18 }}
            >
              <div className="education-matrix__preview-title">[SELECTED NODE DATA // PREVIEW PANEL]</div>
              <div className="education-matrix__preview-line">
                {">"} FOCUS AREAS: {selectedEntry.focusAreas.join(", ")}.
              </div>
              <div className="education-matrix__preview-line">
                {">"} CREDENTIAL ID: {selectedEntry.credentialId} | {selectedEntry.score}
              </div>
            </motion.div>

            <motion.div
              className="education-matrix__badge-cluster"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.26 }}
              aria-hidden
            >
              {educationBadges.map((badge) => (
                <span key={badge.id} className={`education-matrix__badge ${badge.hue}`}>
                  <span className="education-matrix__badge-core">{badge.label}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="education-matrix__footer">SCROLL TO TRAVERSE</div>
      </div>
    </section>
  );
}
