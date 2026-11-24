import {useState} from 'react';
import {CheckCircle2, PawPrint, Star} from 'lucide-react';
import type {
  BookingCategory,
  ClientReview,
  ReviewInput,
  ReviewValidationErrors,
} from '../types/clinic';
import {
  calculateReviewSummary,
  getCategoryLabel,
  getServicesForCategory,
  validateReviewInput,
} from '../utils/clinicLogic';

interface ReviewsSectionProps {
  reviews: ClientReview[];
  onAddReview: (review: ReviewInput) => void;
}

export function ReviewsSection({reviews, onAddReview}: ReviewsSectionProps) {
  const [authorName, setAuthorName] = useState('');
  const [petInfo, setPetInfo] = useState('');
  const [category, setCategory] = useState<BookingCategory>('veterinario');
  const [serviceLabel, setServiceLabel] = useState<string>('Consulta de Rotina');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<ReviewValidationErrors>({});
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const summary = calculateReviewSummary(reviews);
  const serviceOptions = getServicesForCategory(category);

  const handleCategoryChange = (nextCategory: BookingCategory) => {
    setCategory(nextCategory);
    setServiceLabel(getServicesForCategory(nextCategory)[0]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ReviewInput = {
      authorName,
      petInfo,
      category,
      serviceLabel,
      rating,
      comment,
    };

    const validationErrors = validateReviewInput(payload);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onAddReview(payload);
    setAuthorName('');
    setPetInfo('');
    setComment('');
    setRating(5);
    setSubmittedNotice(true);
    window.setTimeout(() => setSubmittedNotice(false), 4500);
  };

  return (
    <section id="avaliacoes" className="scroll-mt-16 py-14 lg:py-20 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C700B] mb-2">
              <PawPrint className="w-3.5 h-3.5 text-[#B5941D]" aria-hidden="true" />
              <span>Avaliações e Comentários dos Clientes</span>
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141414]">
              Quem confia no <span className="text-[#AD8D16]">Império Animal</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-white rounded-2xl border border-[#E8E1C8] px-5 py-3 shadow-2xs self-start lg:self-auto">
            <p className="font-display text-3xl font-extrabold text-[#141414] tabular-nums">
              {summary.average.toFixed(1)}
            </p>
            <div>
              <div className="flex items-center gap-0.5 text-[#DBBD43]" aria-hidden="true">
                {Array.from({length: 5}).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(summary.average) ? 'fill-[#DBBD43]' : 'text-[#DFD7BC]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-[#555147] tabular-nums mt-0.5">
                {summary.total} {summary.total === 1 ? 'avaliação' : 'avaliações'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Review Cards List */}
          <div className="lg:col-span-7 space-y-5" data-testid="reviews-list">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="p-6 rounded-[26px] bg-white border border-[#E8E1C8] shadow-[0_8px_24px_rgba(20,20,20,0.05)] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-[#555147]">
                    <span className="font-bold text-[#8C700B]">
                      {getCategoryLabel(review.category)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{review.serviceLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{review.dateLabel}</span>
                  </div>

                  <div
                    className="flex items-center gap-0.5 text-[#DBBD43]"
                    aria-label={`Nota ${review.rating} de 5 estrelas`}
                  >
                    {Array.from({length: 5}).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-[#DBBD43]' : 'text-[#DFD7BC]'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#141414] leading-relaxed">
                  &ldquo;{review.comment}&rdquo;
                </p>

                <footer className="pt-2.5 border-t border-[#EFEAD6] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-[#141414]">{review.authorName}</span>
                    <span className="text-[#555147]"> · {review.petInfo}</span>
                  </div>
                  {review.verified && (
                    <span className="font-semibold text-[#8C700B]">Tutor verificado</span>
                  )}
                </footer>
              </article>
            ))}
          </div>

          {/* Interactive Review Submission Form */}
          <div className="lg:col-span-5 bg-white rounded-[26px] border border-[#E8E1C8] shadow-[0_10px_28px_rgba(20,20,20,0.06)] p-6 sm:p-7">
            <h3 className="font-display text-2xl font-bold text-[#141414] mb-1.5">
              Compartilhe sua experiência
            </h3>
            <p className="text-sm text-[#555147] mb-6">
              Seu relato ajuda outros tutores de Quirinópolis a conhecerem nosso atendimento.
            </p>

            {submittedNotice && (
              <div
                role="status"
                className="mb-5 p-3.5 rounded-2xl bg-[#FAF4D9] border border-[#DBBD43] flex items-center gap-2.5 text-xs font-bold text-[#141414]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#8C700B] shrink-0" aria-hidden="true" />
                Avaliação publicada com sucesso. Obrigado pelo seu feedback!
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor="review-author"
                  className="block text-xs font-bold text-[#141414] mb-1.5"
                >
                  Seu nome
                </label>
                <input
                  id="review-author"
                  type="text"
                  value={authorName}
                  onChange={(e) => {
                    setAuthorName(e.target.value);
                    if (errors.authorName) setErrors((p) => ({...p, authorName: undefined}));
                  }}
                  placeholder="Ex.: Henrique Duarte"
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FFFDF7] text-sm text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414] ${
                    errors.authorName ? 'border-[#B42318]' : 'border-[#DFD7BC]'
                  }`}
                />
                {errors.authorName && (
                  <p role="alert" className="mt-1 text-xs text-[#B42318]">
                    {errors.authorName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="review-pet"
                  className="block text-xs font-bold text-[#141414] mb-1.5"
                >
                  Nome e raça do pet
                </label>
                <input
                  id="review-pet"
                  type="text"
                  value={petInfo}
                  onChange={(e) => {
                    setPetInfo(e.target.value);
                    if (errors.petInfo) setErrors((p) => ({...p, petInfo: undefined}));
                  }}
                  placeholder="Ex.: Thor · Labrador"
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FFFDF7] text-sm text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414] ${
                    errors.petInfo ? 'border-[#B42318]' : 'border-[#DFD7BC]'
                  }`}
                />
                {errors.petInfo && (
                  <p role="alert" className="mt-1 text-xs text-[#B42318]">
                    {errors.petInfo}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="review-category"
                    className="block text-xs font-bold text-[#141414] mb-1.5"
                  >
                    Área atendida
                  </label>
                  <select
                    id="review-category"
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as BookingCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DFD7BC] bg-[#FFFDF7] text-sm text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414]"
                  >
                    <option value="veterinario">Veterinário</option>
                    <option value="petshop">Pet Shop &amp; Estética</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="review-service"
                    className="block text-xs font-bold text-[#141414] mb-1.5"
                  >
                    Serviço
                  </label>
                  <select
                    id="review-service"
                    value={serviceLabel}
                    onChange={(e) => setServiceLabel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DFD7BC] bg-[#FFFDF7] text-sm text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414]"
                  >
                    {serviceOptions.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <fieldset>
                <legend className="text-xs font-bold text-[#141414] mb-1.5">
                  Sua avaliação
                </legend>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      aria-label={`Dar nota ${starValue} de 5 estrelas`}
                      aria-pressed={rating === starValue}
                      className="p-1.5 rounded-full hover:bg-[#FAF4D9] transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          starValue <= rating
                            ? 'fill-[#DBBD43] text-[#DBBD43]'
                            : 'text-[#DFD7BC]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold tabular-nums text-[#555147]">
                    {rating}.0 / 5.0
                  </span>
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-xs font-bold text-[#141414] mb-1.5"
                >
                  Comentário
                </label>
                <textarea
                  id="review-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (errors.comment) setErrors((p) => ({...p, comment: undefined}));
                  }}
                  placeholder="Conte como foi a consulta, vacinação ou banho e tosa do seu pet..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FFFDF7] text-sm text-[#141414] focus:outline-none focus:ring-2 focus:ring-[#DBBD43]/50 focus:border-[#141414] ${
                    errors.comment ? 'border-[#B42318]' : 'border-[#DFD7BC]'
                  }`}
                />
                {errors.comment && (
                  <p role="alert" className="mt-1 text-xs text-[#B42318]">
                    {errors.comment}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 text-sm font-bold text-white bg-[#141414] hover:bg-[#2A2822] rounded-full transition-colors duration-150 cursor-pointer"
              >
                Publicar avaliação
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
